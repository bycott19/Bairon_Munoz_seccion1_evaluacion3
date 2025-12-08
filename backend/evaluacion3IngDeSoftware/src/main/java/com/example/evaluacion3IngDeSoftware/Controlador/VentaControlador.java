package com.example.evaluacion3IngDeSoftware.Controlador;

import com.example.evaluacion3IngDeSoftware.Modelo.Venta;
import com.example.evaluacion3IngDeSoftware.Repositorio.VentaRepositorio;
import com.example.evaluacion3IngDeSoftware.Servicios.VentaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> confirmar(@RequestParam Long cotizacionId) {
        try {
            Venta venta = servicio.confirmarVentaDesdeCotizacion(cotizacionId);
            return new ResponseEntity<>(venta, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public List<Venta> listar() {
        return repositorio.findAll();
    }
}