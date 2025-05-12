<?php
class shop_dao
{
    static $_instance;

    private function __construct() {}

    public static function getInstance()
    {
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function select_all_books($db, $offset)
    {
        
        $limit = 4;
        $sql = "SELECT l.id_libro, l.titulo, l.descripcion, l.precio, l.longi, l.lat,  
        GROUP_CONCAT(i.url ORDER BY i.url SEPARATOR ':') AS imagenes
        FROM `libros` l
        INNER JOIN `imagenes_prod` i 
        ON l.id_libro = i.id_libro
        GROUP BY l.id_libro
        LIMIT $limit OFFSET $offset";

        $stmt = $db->ejecutar($sql);
            
        $retrArray = [];
        if (mysqli_num_rows($stmt) > 0) {
            while ($row = mysqli_fetch_assoc($stmt)) {
                $retrArray[] = array(
                    "id_libro" => $row["id_libro"],
                    "titulo" => $row["titulo"],
                    "descripcion" => $row["descripcion"],
                    "precio" => $row["precio"],
                    "longi" => $row["longi"],
                    "lat" => $row["lat"],
                    "imagenes" => explode(":", $row['imagenes'])
                );
            }
        }

        return $retrArray;
    }

    function select_details($db, $id)
    {

        $sql = "SELECT c.*, b.*, t.*, ct.* FROM cars c INNER JOIN brand b INNER JOIN type t INNER JOIN category ct ON c.brand = b.cod_brand "
            . "AND c.type = t.cod_type AND c.category = ct.cod_category WHERE c.id = '$id'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_details_images($db, $id)
    {

        $details = self::select_details($db, $id);
        $sql = "SELECT image_name FROM car_images WHERE id_car = '$id'";

        $stmt = $db->ejecutar($sql);

        $array = array();

        if (mysqli_num_rows($stmt) > 0) {
            foreach ($stmt as $row) {
                array_push($array, $row);
            }
        }

        $rdo = array();
        $rdo[0] = $details;
        $rdo[1][] = $array;

        return $rdo;
        // return $db->listar($array);
        // return $db->listar($rdo);
    }

    public function select_filters($db)
    {
        $sql = "SELECT 
            ff.filtro AS filtro, 
            ff.formato, 
            CASE 
                WHEN ff.filtro = 'categoria' THEN c.id_categoria
                WHEN ff.filtro = 'estado' THEN e.id_estado
                WHEN ff.filtro = 'tipo' THEN t.id_tipo
                WHEN ff.filtro = 'editorial' THEN ed.id_editorial
                WHEN ff.filtro = 'tipo_venta' THEN tv.id_tipo_venta
                WHEN ff.filtro = 'localizacion' THEN l.id_localizacion
            END AS id_opcion,
            CASE 
                WHEN ff.filtro = 'categoria' THEN c.categoria
                WHEN ff.filtro = 'estado' THEN e.estado
                WHEN ff.filtro = 'tipo' THEN t.tipo
                WHEN ff.filtro = 'editorial' THEN ed.editorial
                WHEN ff.filtro = 'tipo_venta' THEN tv.tipo_venta
                WHEN ff.filtro = 'localizacion' THEN l.ciudad
            END AS nombre_opcion,
            (SELECT MIN(precio) FROM libros) AS precio_min,
            (SELECT MAX(precio) FROM libros) AS precio_max
            FROM filtros ff
            LEFT JOIN categorias c ON ff.filtro = 'categoria'
            LEFT JOIN estado e ON ff.filtro = 'estado'
            LEFT JOIN tipos t ON ff.filtro = 'tipo'
            LEFT JOIN editorial ed ON ff.filtro = 'editorial'
            LEFT JOIN tipo_venta tv ON ff.filtro = 'tipo_venta'
            LEFT JOIN localizacion l ON ff.filtro = 'localizacion'
            ORDER BY ff.filtro, id_opcion";

        $stmt = $db->ejecutar($sql);

        $retrArray = [];
        $precio_min = null;
        $precio_max = null;

        if (mysqli_num_rows($stmt) > 0) {
            while ($row = mysqli_fetch_assoc($stmt)) {
                $retrArray[$row["filtro"]]["formato"] = $row["formato"];
                $retrArray[$row["filtro"]]["opciones"][] = array(
                    "id" => $row["id_opcion"],
                    "nombre" => $row["nombre_opcion"]
                );
                $precio_min = $row["precio_min"];
                $precio_max = $row["precio_max"];
            }
        }

        if ($precio_min !== null && $precio_max !== null) {
            $retrArray["precio"] = array(
                "min" => $precio_min,
                "max" => $precio_max
            );
        }

        return $retrArray;
    }

    function sql_filter($filters)
    {
        $continue = "";
        $cont = 0;
        $cont1 = 0;
        $cont2 = 0;
        $select = ' WHERE ';
        foreach ($filters as $key => $row) {
            foreach ($row as $key => $row_inner) {
                if ($cont == 0) {
                    foreach ($row_inner as $value) {
                        if ($cont1 == 0) {
                            $continue = $key . ' IN ("' . $value . '"';
                        } else {
                            $continue = $continue  . ', "' . $value . '"';
                        }
                        $cont1++;
                    }
                    $continue = $continue . ')';
                } else {
                    foreach ($row_inner as $value) {
                        if ($cont2 == 0) {
                            $continue = ' AND ' . $key . ' IN ("' . $value . '"';
                        } else {
                            $continue = $continue . ', "' . $value . '"';
                        }
                        $cont2++;
                    }
                    $continue = $continue . ')';
                }
            }
            $cont++;
            $cont2 = 0;
            $select = $select . $continue;
        }
        return $select;
    }

    public function filters($db, $orderby, $total_prod, $items_page, $query)
    {

        $sql_filter = self::sql_filter($query);

        $sql = "SELECT c.*, b.*, t.*, ct.* FROM cars c INNER JOIN brand b INNER JOIN type t INNER JOIN category ct ON c.brand = b.cod_brand "
            . "AND c.category = ct.cod_category AND c.type = t.cod_type $sql_filter ORDER BY $orderby visits DESC LIMIT $total_prod, $items_page";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function maps_details($db, $id)
    {

        $sql = "SELECT id, city, lat, lng FROM cars WHERE id = '$id'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function update_view($db, $id)
    {

        $sql = "UPDATE cars c SET visits = visits + 1 WHERE id = '$id'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_count($db)
    {

        $sql = "SELECT COUNT(*) AS num_cars FROM cars";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_count_filters($db, $query)
    {

        $filters = self::sql_filter($query);

        $sql = "SELECT COUNT(*) AS num_cars FROM cars c INNER JOIN brand b INNER JOIN type t INNER JOIN category ct ON c.brand = b.cod_brand "
            . "AND c.category = ct.cod_category AND c.type = t.cod_type $filters";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_cars($db, $category, $type, $id, $loaded, $items)
    {

        $sql = "SELECT c.*, b.*, t.*, ct.* FROM cars c INNER JOIN brand b INNER JOIN type t INNER JOIN category ct ON c.brand = b.cod_brand "
            . "AND c.type = t.cod_type AND c.category = ct.cod_category WHERE c.category = '$category' AND c.id <> $id OR c.type = '$type' AND c.id <> $id LIMIT $loaded, $items";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_load_likes($db, $username)
    {

        $sql = "SELECT id_car FROM likes WHERE username='$username'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_likes($db, $id, $username)
    {

        $sql = "SELECT username, id_car FROM likes WHERE username='$username' AND id_car='$id'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function insert_likes($db, $id, $username)
    {

        $sql = "INSERT INTO likes (username, id_car) VALUES ('$username','$id')";

        $stmt = $db->ejecutar($sql);
        return "like";
    }

    function delete_likes($db, $id, $username)
    {

        $sql = "DELETE FROM likes WHERE username='$username' AND id_car='$id'";

        $stmt = $db->ejecutar($sql);
        return "unlike";
    }
}
