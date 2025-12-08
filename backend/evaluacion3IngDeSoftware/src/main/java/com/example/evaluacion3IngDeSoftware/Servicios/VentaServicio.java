package com.example.evaluacion3IngDeSoftware.Servicios;

import com.example.evaluacion3IngDeSoftware.Modelo.*;
import com.example.evaluacion3IngDeSoftware.Repositorio.CotizacionRepositorio;
import com.example.evaluacion3IngDeSoftware.Repositorio.MuebleRepositorio;
import com.example.evaluacion3IngDeSoftware.Repositorio.VentaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class VentaServicio {

    @Autowired
    private VentaRepositorio ventaRepositorio;
    @Autowired
    private CotizacionRepositorio cotizacionRepositorio;
    @Autowired
    private MuebleRepositorio muebleRepositorio;

    @Transactional
    public Venta confirmarVentaDesdeCotizacion(Long cotizacionId) {
        Cotizacion c = cotizacionRepositorio.findById(cotizacionId)
                .orElseThrow(() -> new RuntimeException("No existe la cotización " + cotizacionId));

        if (ventaRepositorio.existsByCotizacionId(cotizacionId)) {
            throw new RuntimeException("La cotización " + cotizacionId + " ya fue convertida en venta anteriormente.");
        }

        if (c.getItems().isEmpty()) {
            throw new RuntimeException("La cotización no tiene items");
        }

        Map<Long, Integer> demandaPorMueble = new HashMap<>();

        for (CotizacionItem item : c.getItems()) {
            Mueble m = item.getMueble();
            if (m.getEstado() == EstadoMueble.INACTIVO) {
                throw new RuntimeException("Venta cancelada: El mueble '" + m.getNombre() + "' no está disponible.");
            }

            Long id = m.getId();
            demandaPorMueble.put(id, demandaPorMueble.getOrDefault(id, 0) + item.getCantidad());
        }

        for (Map.Entry<Long, Integer> entry : demandaPorMueble.entrySet()) {
            Long muebleId = entry.getKey();
            Integer cantidadTotalRequerida = entry.getValue();

            Mueble m = muebleRepositorio.findById(muebleId)
                    .orElseThrow(() -> new RuntimeException("Mueble no encontrado ID: " + muebleId));

            if (cantidadTotalRequerida > m.getStock()) {
                throw new RuntimeException("Stock insuficiente para '" + m.getNombre() +
                        "'. Solicitas " + cantidadTotalRequerida + " en total, pero solo quedan " + m.getStock());
            }
        }

        c.setConfirmada(Boolean.TRUE);
        cotizacionRepositorio.save(c);

        for (CotizacionItem it : c.getItems()) {
            Mueble m = it.getMueble();
            m.setStock(m.getStock() - it.getCantidad());
            muebleRepositorio.save(m);
        }

        Venta v = new Venta();
        v.setCotizacion(c);
        v.setFechaConfirmacion(LocalDateTime.now());
        v.setTotal(c.getTotal());
        return ventaRepositorio.save(v);
    }
}