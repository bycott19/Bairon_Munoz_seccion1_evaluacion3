package com.example.evaluacion3IngDeSoftware.Repositorio;

import com.example.evaluacion3IngDeSoftware.Modelo.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VentaRepositorio extends JpaRepository<Venta, Long> {
    boolean existsByCotizacionId(Long cotizacionId);
    Optional<Venta> findByCotizacionId(Long cotizacionId);
}
