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

        $retrArray = $db->listar($stmt);

        if (!empty($retrArray)) {
            foreach ($retrArray as &$row) {
                $row["imagenes"] = explode(":", $row["imagenes"]);
            }
        }


        return $retrArray;
    }

    function select_details($db, $id)
    {

        $sql = "SELECT l.longi, l.lat, t.id_tipo,
			l.*, 
			GROUP_CONCAT(DISTINCT a.autor SEPARATOR ', ') AS autores, 
			GROUP_CONCAT(DISTINCT e.editorial SEPARATOR ', ') AS editoriales, 
			GROUP_CONCAT(DISTINCT c.categoria SEPARATOR ', ') AS categorias
		FROM libros l
		LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
		LEFT JOIN autores a ON la.id_autor = a.id_autor
		LEFT JOIN libro_editorial le ON l.id_libro = le.id_libro
		LEFT JOIN editorial e ON le.id_editorial = e.id_editorial
		LEFT JOIN libro_categoria lc ON l.id_libro = lc.id_libro
		LEFT JOIN categorias c ON lc.id_categoria = c.id_categoria
		LEFT JOIN libro_tipo lt ON lt.id_libro =l.id_libro
		LEFT JOIN tipos t ON lt.id_tipo = t.id_tipo
		WHERE l.id_libro = '$id'
		GROUP BY l.id_libro";

        // echo json_encode($sql);
        // exit;

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_extras_book($db, $id)
    {
        $sql = "SELECT e.id_extra, e.extra, e.icono
            FROM libro_extra le  
            INNER JOIN extras e ON le.id_extra = e.id_extra  
            WHERE le.id_libro = '$id'";

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_details_images($db, $id)
    {

        $details = self::select_details($db, $id);
        $extras = self::select_extras_book($db, $id);

        // echo json_encode($details);
        // exit;
        $sql = "SELECT i.id_libro, i.url  
		FROM imagenes_prod i  
		WHERE i.id_libro = '$id'";

        $stmt = $db->ejecutar($sql);

        $array = array();

        if (mysqli_num_rows($stmt) > 0) {
            foreach ($stmt as $row) {
                array_push($array, $row);
            }
        }

        $rdo = array();
        $rdo = $details;
        $rdo[1][] = $array;
        $rdo[2][] = $extras;

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

    public function select_more_related($db, $type_book, $offset, $limit)
    {
        $sql = "SELECT l.id_libro, l.titulo, l.descripcion, l.precio, 
                GROUP_CONCAT(DISTINCT i.url ORDER BY i.url SEPARATOR ':') AS imagenes
                FROM libros l
                INNER JOIN libro_tipo lt ON l.id_libro = lt.id_libro
                INNER JOIN imagenes_prod i ON l.id_libro = i.id_libro
                WHERE lt.id_tipo = '" . mysqli_real_escape_string($db->link, $type_book) . "'	
                GROUP BY l.id_libro
                LIMIT " . intval($limit) . " OFFSET " . intval($offset);

        $stmt = $db->ejecutar($sql);
        $retrArray = $db->listar($stmt);

        if (!empty($retrArray)) {
            foreach ($retrArray as &$row) {
                $row["imagenes"] = explode(":", $row["imagenes"]);
            }
        }

        return $retrArray;
    }

    public function count_more_related($db, $type_book)
    {
        $sql = "SELECT COUNT(*) AS n_books
                FROM libros l
                INNER JOIN libro_tipo lt ON l.id_libro = lt.id_libro
                WHERE lt.id_tipo = '" . mysqli_real_escape_string($db->link, $type_book) . "'";

        $stmt = $db->ejecutar($sql);
        $result = mysqli_fetch_assoc($stmt);

        return $result;
    }

    public function filters($db, $filter, $offset)
    {
        $limit = 4;

        $sql = "SELECT l.id_libro, l.titulo, l.descripcion, l.precio, l.longi, l.lat,
                GROUP_CONCAT(DISTINCT i.url ORDER BY i.url SEPARATOR ':') AS imagenes
            FROM libros l
            INNER JOIN imagenes_prod i ON l.id_libro = i.id_libro
            INNER JOIN libro_categoria lc ON l.id_libro = lc.id_libro
            INNER JOIN categorias c ON lc.id_categoria = c.id_categoria
            INNER JOIN libro_tipo lt ON l.id_libro = lt.id_libro
            INNER JOIN tipos t ON lt.id_tipo = t.id_tipo
            INNER JOIN libro_editorial le ON l.id_libro = le.id_libro
            INNER JOIN editorial e ON le.id_editorial = e.id_editorial
            INNER JOIN tipo_venta v ON l.id_tipo_venta = v.id_tipo_venta
            INNER JOIN estado es ON l.id_estado = es.id_estado
            WHERE 1=1";

        if (!empty($filter)) {
            foreach ($filter as $key => $value) {
                if ($value !== "*") {
                    switch ($key) {
                        case "categoria":
                            if (is_array($value)) {
                                $categories = implode(",", array_map('intval', $value));
                                $sql .= " AND c.id_categoria IN ($categories)";
                            } else {
                                $sql .= " AND c.id_categoria = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            }
                            break;
                        case "tipo":
                            $sql .= " AND t.id_tipo = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "tipo_venta":
                            $sql .= " AND v.id_tipo_venta = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "editorial":
                            $sql .= " AND e.id_editorial = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "estado":
                            $sql .= " AND es.id_estado = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "localizacion":
                            $sql .= " AND l.id_localizacion = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "precio":
                            $sql .= " AND l.precio BETWEEN " . mysqli_real_escape_string($db->link, $value[0]) . " AND " . mysqli_real_escape_string($db->link, $value[1]);
                            break;
                        case "title":
                            $sql .= " AND l.titulo LIKE '" . mysqli_real_escape_string($db->link, $filter['title']) . "%'";
                            break;
                    }
                }
            }
        }

        $sql .= " GROUP BY l.id_libro";

        if (!empty($filter['ordenar'])) {
            $order_parts = explode(":", $filter['ordenar']);
            if (count($order_parts) === 2) {
                $column = mysqli_real_escape_string($db->link, $order_parts[0]);
                $direction = strtoupper(mysqli_real_escape_string($db->link, $order_parts[1]));
                if (in_array($direction, ['ASC', 'DESC'])) {
                    $sql .= " ORDER BY $column $direction";
                }
            }
        }

        $sql .= " LIMIT $limit OFFSET $offset";

        $stmt = $db->ejecutar($sql);
        $retrArray = $db->listar($stmt);

        if (!empty($retrArray)) {
            foreach ($retrArray as &$row) {
                $row["imagenes"] = explode(":", $row["imagenes"]);
            }
        }

        return $retrArray;
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
        $sql = "SELECT COUNT(DISTINCT l.id_libro) AS total_books
                FROM libros l
                INNER JOIN imagenes_prod i ON l.id_libro = i.id_libro";

        $stmt = $db->ejecutar($sql);
        $result = mysqli_fetch_assoc($stmt);

        return $result['total_books'] ?? 0;
    }

    public function select_count_filters($db, $filter)
    {
        $sql = "SELECT COUNT(DISTINCT l.id_libro) AS total
            FROM libros l
            INNER JOIN imagenes_prod i ON l.id_libro = i.id_libro
            INNER JOIN libro_categoria lc ON l.id_libro = lc.id_libro
            INNER JOIN categorias c ON lc.id_categoria = c.id_categoria
            INNER JOIN libro_tipo lt ON l.id_libro = lt.id_libro
            INNER JOIN tipos t ON lt.id_tipo = t.id_tipo
            INNER JOIN libro_editorial le ON l.id_libro = le.id_libro
            INNER JOIN editorial e ON le.id_editorial = e.id_editorial
            INNER JOIN tipo_venta v ON l.id_tipo_venta = v.id_tipo_venta
            INNER JOIN estado es ON l.id_estado = es.id_estado
            WHERE 1=1";

        if (!empty($filter)) {
            foreach ($filter as $key => $value) {
                if ($value !== "*") {
                    switch ($key) {
                        case "categoria":
                            if (is_array($value)) {
                                $categories = implode(",", array_map('intval', $value));
                                $sql .= " AND c.id_categoria IN ($categories)";
                            } else {
                                $sql .= " AND c.id_categoria = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            }
                            break;
                        case "tipo":
                            $sql .= " AND t.id_tipo = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "tipo_venta":
                            $sql .= " AND v.id_tipo_venta = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "editorial":
                            $sql .= " AND e.id_editorial = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "estado":
                            $sql .= " AND es.id_estado = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "localizacion":
                            $sql .= " AND l.id_localizacion = '" . mysqli_real_escape_string($db->link, $value) . "'";
                            break;
                        case "precio":
                            $sql .= " AND l.precio BETWEEN " . mysqli_real_escape_string($db->link, $value[0]) . " AND " . mysqli_real_escape_string($db->link, $value[1]);
                            break;
                        case "title":
                            $sql .= " AND l.titulo LIKE '" . mysqli_real_escape_string($db->link, $filter['title']) . "%'";
                            break;
                    }
                }
            }
        }

        $stmt = $db->ejecutar($sql);
        $result = mysqli_fetch_assoc($stmt);

        return $result['total'] ?? 0;
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
