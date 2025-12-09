COMO EJUECUTAR EL PROGRAMA

------------------------------------------------------------------------------------------------------------------------
1. EN PRIMER LUGAR DEBE TENER DOCKER DESKTOP ABIERTO PARA QUE FUNCIONE EL CODIGO
------------------------------------------------------------------------------------------------------------------------

2. ACCEDA A LA RUTA DE LA CARPETA PRINCIPAL CON EL CMD

    - EJEMPLO DE ACCESO A LA RUTA PRINCIPAL: cd C:\Users\bycot\IdeaProjects\Munoz_Bairon_seccion1_evaluacion3
------------------------------------------------------------------------------------------------------------------------

3. EJECUTAR EL PROYECTO COMPLETO

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

TEMA APARTE, SI LE DA EL SIGUIENTE ERROR AL EJECUTAR:
Attaching to muebleria_backend_bairon, muebleria_db_bairon, muebleria_frontend_bairon Error response from daemon: failed to set up container networking:
driver failed programming external connectivity on endpoint muebleria_db_bairon (2cdeeb6f2027ed0aeb7e6cee1e78d6baf9693f37ee15c9ffdd443d5574b6ad64):
Bind for 0.0.0.0:3307 failed: port is already allocated

SIGNIFICA QUE EL PUERTO QUE UTILICE ESTA OCUPADO EN SU DISPOSITIVO, POR LO QUE DEBERA ACCEDER AL CODIGO Y CAMBIAR EL
PUERTO MANUALMENTE:
    1. ABRA EL ARCHIVO: docker-compose.yml
    2. BUSQUE DONDE DICE EN BASE DE DATOS:     ports:
                                                    - "3307:3306"
    3. Y CAMBIE EL PRIMER PUERTO QUE SALGA POR UNO QUE TENGA DISPONIBLE, POR EJEMPLO: ports:
                                                                                        - "3308:3306"
