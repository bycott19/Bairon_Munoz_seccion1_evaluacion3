package com.example.evaluacion3IngDeSoftware.Repositorio;

import com.example.evaluacion3IngDeSoftware.Modelo.Variante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VarianteRepositorio extends JpaRepository<Variante, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}