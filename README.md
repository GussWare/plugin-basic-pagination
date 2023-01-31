 
# Plugin Basic Pagination 
Este plugin proporciona una solución de paginación sencilla y eficiente para tus proyectos en jQuery. Manteniento la funcionalidad del paginado por separado de la presentación. Esto te permite a ti elegir si la paginación se muestra en tabla o en una lista o en algun otro elemento. 

 
 
## Instalación  
Para utilizar instalar el plugin es necesario utilizar npm  

~~~bash  
  npm i plugin-basic-pagination
~~~

 
## Usage/Examples  
Hay que tener un documento html5 con la siguiente estructura
~~~html  
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">
</head>

<body>
    <div class="row">
        <div class="col-md-12">
            <div class="roles-pages-container buttons-pagination"></div>
            <table id="roles-table" class="datatables-demo table table-striped table-bordered table-responsive">
                <thead>
                    <tr>
                        <th data-name="id" style="width: 5%;"></th>
                        <th data-name="name" style="width: 25%;">
                            name
                        </th>
                        <th data-name="slug" style="width: 25%;">
                            slug
                        </th>
                        <th data-name="description" style="width: 30%;">
                            description
                        </th>
                        <th data-name="enabled" style="width: 5%;">
                            enabled
                        </th>
                        <th data-name="id" style="width: 10%;">
                            actions
                        </th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="roles-pages-container buttons-pagination"></div>
        </div>
    </div>

    <script id="roles-table-template" type="text/x-handlebars-template">
            <tr>
                <td>{{id}}</td>
                <td>{{name}}</td>
                <td>{{slug}}</td>
                <td>{{description}}</td>
                <td>{{enabled}}</td>
                <td>
                    <a class="btn-edit" href="javascript:void(0);">Editar</a>
                    <a class="btn-delete" href="javascript:void(0);">Eliminar</a>
                </td>
            </tr>
     </script>

    <script src="node_modules/jquery/dist/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
    <script src="src/jquery.BasicPagination.js"></script>

</body>

</html>
~~~  

Puedes agregar dentro del mismo documento el siguiente codigo javascript o bien agregarlo en un documento por separado

~~~javascript
$(document).ready(function () {

            var RolesTable = $("#roles-table").BasicPagination({
                serverSide: {
                    apiUrl: 'http://localhost/boilerplate-codeigniter3/roles/pagination',
                },
                paginationId: 'roles-table',
                templateId: 'roles-table-template',
                pagesContainerClass: 'roles-pages-container'
            }).on("observerActions", function (event, pagination) {
                var trTable = pagination.find('tbody').find('tr');

                $.each(trTable, function (key, tr) {
                    var btnEdit = $(tr).find('td').eq(5).find('a.btn-edit');
                    var btnDelete = $(tr).find('td').eq(5).find('a.btn-delete');

                    btnEdit.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        alert("clic btn Edit")
                    });

                    btnDelete.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        alert("clic btn Delete")
                    });                    
                });

            });


            setTimeout(function(){
                alert("se ejecutara el metodo callServerSide();");

                RolesTable.callServerSide();
            }, 3000);
        });
~~~

 
## Tech Stack  
**Client:** javascript, html, css

 
## License  
[MIT](https://choosealicense.com/licenses/mit/)  
