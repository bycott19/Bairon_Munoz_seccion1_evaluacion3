package com.example.evaluacion3IngDeSoftware.Controlador;

import com.example.evaluacion3IngDeSoftware.Modelo.Venta;
import com.example.evaluacion3IngDeSoftware.Repositorio.VentaRepositorio;
import com.example.evaluacion3IngDeSoftware.Servicios.VentaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaControlador {

    @Autowired
    private VentaServicio servicio;
    @Autowired
    private VentaRepositorio repositorio;

    @PostMapping("/confirmar")
    @ResponseStatus(HttpStatus.CREATED)
    public Venta confirmar(@RequestParam Long cotizacionId) {
        return servicio.confirmarVentaDesdeCotizacion(cotizacionId);
    }
    @GetMapping
    public List<Venta> listar() {
        return repositorio.findAll();
    }
}
