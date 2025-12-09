package com.example.evaluacion3IngDeSoftware.Controlador;

import com.example.evaluacion3IngDeSoftware.Modelo.Mueble;
import com.example.evaluacion3IngDeSoftware.Servicios.MuebleServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/muebles")
@CrossOrigin(origins = "*")
public class MuebleControlador {
    @Autowired
    private MuebleServicio muebleServicio;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Mueble mueble) {
        try {
            Mueble creado = muebleServicio.crear(mueble);
            return new ResponseEntity<>(creado, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public List<Mueble> listar() {
        return muebleServicio.listar();
    }

    @GetMapping("/{id}")
    public Mueble obtener(@PathVariable Long id) {
        return muebleServicio.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Mueble datos) {
        try {
            Mueble actualizado = muebleServicio.actualizar(id, datos);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/desactivar")
    public Mueble desactivar(@PathVariable Long id) {
        return muebleServicio.desactivar(id);
    }

    @PatchMapping("/{id}/activar")
    public Mueble activar(@PathVariable Long id) {
        return muebleServicio.activar(id);
    }
}