COMO EJUECUTAR EL PROGRAMA

1. EN PRIMER LUGAR DEBE TENER DOCKER DESKTOP ABIERTO PARA QUE FUNCIONE EL CODIGO
------------------------------------------------------------------------------------------------------------------------

2. COMPILAR EL BACKEND (ACCEDA A LA RUTA DE LA CARPETA PRINCIPAL)

    - EJEMPLO DE ACCESO A LA RUTA PRINCIPAÑ: cd C:\Users\bycot\IdeaProjects\Munoz_Bairon_seccion1_evaluacion3

    - ACCEDER A LA RUTA DEL BACKEND: cd backend/evaluacion3IngDeSoftware

    - COMPILAR EL BACKEND WINDOWS: .\mvnw.cmd clean package -DskipTests

        - COMPILAR EL BACKEND LINUX/MAC: ./mvnw clean package -DskipTests

    NOTA: Una vez hechos estos pasos le saldra un mensaje en el cmd que dira "BUILD SUCCESS"
------------------------------------------------------------------------------------------------------------------------

3. VOLVER A LA RUTA PRINCIPAL

    - ESCRIBA EN EL CMD: cd ..
    - VUELVA A ESCRIBIRLO : cd ..

    NOTA: Volvera a la ruta inicial de la carpeta principal (La primera ruta que ingreso por el cmd)
------------------------------------------------------------------------------------------------------------------------

4. EJECUTAR EL PROYECTO COMPLETO

    - INGRESE EL COMANDO EN EL CMD: docker-compose up --build

    NOTA: Debera esperar un tiempo a que compile, puede tardar un tiempo y depende de la conexión a internet, ya que
          la primera vez que se ejecuta se descargan unos archivos.

        - IMPORTANTE EN CASO DE ERRORES: SI POR ALGUN MOTIVO EL PROYECTO SE CAE PORQUE EL CONTENEDOR DEL DOCKER ESTA
                     OCUPADO POR OTRO PROYECTO, EJECUTE EL SIGUIENTE COMANDO POR EL CMD EN LA CARPETA PRINCIPAL:

                      - docker-compose down -v (Limpia la imagen docker para construirla de nuevo)

                      LUEGO VUELVA A EJECUTAR EL SIGUIENTE COMANDO:

                      -  docker-compose up --build
------------------------------------------------------------------------------------------------------------------------

5. ABRIR EN EL NAVEGADOR

    - ACCEDA A LA SIGUIENTE RUTA EN EL NAVEGADOR QUE DESEE: http://localhost

    NOTA: ESA RUTA ABRIRA LA TIENDA PRINCIPAL, DONDE SE VERAN LOS PRODUCTOS CARGADOS Y SE PODRAN COMPRAR LOS MUEBLES,
          LUEGO HAY UNA OPCIÓN PARA DIRIGIRSE A EL APARTADO DE ADMIN, DONDE SE PUEDEN CREAR MUEBLES, VARIACIONES, O
          VER EL INVENTARIO EXISTENTE, LAS VENTAS Y LA LISTA DE VARIANTES.
          NO SE OPTO POR SEGURIDAD DE VALIDAR QUE USUARIO ACCEDE A ADMIN YA QUE NO ERA SOLICITADO, SOLO SE REALIZO LO
          PEDIDO EN EL ENUNCIADO.
------------------------------------------------------------------------------------------------------------------------
