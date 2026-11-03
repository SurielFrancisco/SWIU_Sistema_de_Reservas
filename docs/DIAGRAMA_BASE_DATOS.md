# Diagrama de base de datos — SDReservas

Este modelo adapta el diagrama original a las entidades y datos que utiliza actualmente la aplicación. Está pensado para una futura persistencia relacional; no representa la implementación actual, que todavía usa Redux y `localStorage`.

```mermaid
erDiagram
    CLIENTE {
        uuid id_cliente PK
        string nombre
        string apellidos
        string email UK
        string telefono
        string direccion
        decimal reputacion
        datetime creado_en
    }

    ADMINISTRADOR {
        uuid id_administrador PK
        string nombre
        string apellidos
        string email UK
        string telefono
        string direccion
        string password_hash
        datetime creado_en
    }

    RESTAURANTE {
        uuid id_restaurante PK
        uuid id_administrador FK
        string nombre
        string tipo
        string ubicacion
        string telefono
        string rfc
        decimal calificacion
        string imagen_url
        string estado
        int limite_mesas
    }

    EMPLEADO {
        uuid id_empleado PK
        string nombre
        string apellidos
        string email UK
        string telefono
        string direccion
        string password_hash
    }

    RESTAURANTE_EMPLEADO {
        uuid id_restaurante FK
        uuid id_empleado FK
        string rol
        string turno
        datetime asignado_en
    }

    PISO {
        uuid id_piso PK
        uuid id_restaurante FK
        string nombre
        int orden
    }

    AREA {
        uuid id_area PK
        uuid id_piso FK
        string nombre
        decimal posicion_x
        decimal posicion_y
        decimal ancho
        decimal alto
        string color
    }

    MESA {
        uuid id_mesa PK
        uuid id_piso FK
        uuid id_area FK
        string etiqueta
        int capacidad
        string forma
        string estado
        decimal posicion_x
        decimal posicion_y
        boolean accesible
    }

    HORARIO_RESTAURANTE {
        uuid id_horario PK
        uuid id_restaurante FK
        string dia_semana
        boolean habilitado
        time hora_apertura
        time hora_cierre
    }

    MODALIDAD_RESERVA {
        uuid id_modalidad PK
        string codigo UK
        string nombre
        boolean requiere_pago
        boolean requiere_mesa
    }

    RESTAURANTE_MODALIDAD {
        uuid id_restaurante FK
        uuid id_modalidad FK
    }

    RESERVA {
        uuid id_reserva PK
        uuid id_cliente FK
        uuid id_restaurante FK
        uuid id_piso FK
        uuid id_mesa FK
        string nombre_cliente
        date fecha
        time hora
        int duracion_minutos
        int numero_personas
        string estado
        string preferencias
        uuid id_modalidad FK
        datetime fecha_registro
    }

    PAGO_RESERVA {
        uuid id_pago PK
        uuid id_reserva FK
        decimal importe
        string estado
        string concepto
        string referencia
        datetime fecha_pago
    }

    ADMINISTRADOR ||--o{ RESTAURANTE : administra
    RESTAURANTE ||--o{ RESTAURANTE_EMPLEADO : asigna
    EMPLEADO ||--o{ RESTAURANTE_EMPLEADO : trabaja
    RESTAURANTE ||--o{ PISO : contiene
    PISO ||--o{ AREA : organiza
    PISO ||--o{ MESA : contiene
    AREA o|--o{ MESA : agrupa
    RESTAURANTE ||--o{ HORARIO_RESTAURANTE : configura
    RESTAURANTE ||--o{ RESTAURANTE_MODALIDAD : ofrece
    MODALIDAD_RESERVA ||--o{ RESTAURANTE_MODALIDAD : habilita
    CLIENTE ||--o{ RESERVA : realiza
    RESTAURANTE ||--o{ RESERVA : recibe
    PISO ||--o{ RESERVA : ubica
    MESA ||--o{ RESERVA : asigna
    MODALIDAD_RESERVA ||--o{ RESERVA : utiliza
    RESERVA ||--o| PAGO_RESERVA : genera
```

## Decisiones de adaptación

- `PISO`, `MESA` y `AREA` separan el plano interactivo que actualmente está anidado dentro del restaurante.
- `RESTAURANTE_EMPLEADO` resuelve correctamente la relación muchos-a-muchos del diagrama original.
- `HORARIO_RESTAURANTE` corresponde al horario semanal configurable desde el panel administrativo.
- `MODALIDAD_RESERVA` y `PAGO_RESERVA` cubren las modalidades y anticipos simulados por el formulario actual.
- `estado` de `RESERVA` admite `upcoming`, `completed` y `cancelled`; `estado` de `MESA` admite `available`, `reserved`, `occupied` y `out-of-service`.
- Las contraseñas se representan como `password_hash`; nunca deben almacenarse en texto plano.
- En una implementación real, `RESERVA` debe tener una restricción para impedir solapamientos de reservas activas sobre la misma mesa.
