 
# Plugin Basic Pagination 
Este plugin proporciona una solución de paginación sencilla y eficiente para tus proyectos en jQuery. Manteniento la funcionalidad del paginado por separado de la presentación. Esto te permite a ti elegir si la paginación se muestra en tabla o en una lista o en algun otro elemento. 

 
 
## Instalación  
Para utilizar instalar el plugin es necesario utilizar npm  

~~~bash  
  npm i plugin-basic-pagination
~~~

 
## Usage/Examples  
Hay que tener un documento html5 con la siguiente estructura, como puedes notar existen 2 templates para que el desarrollador elija la manera de como se mostraran el paginado y la paginación. El plugin ya no se encarga de poner lo botones ni nada. Ahora se hace desde los templates de handlebars
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

    

    <script id="roles-pages-template" type="text/x-handlebars-template">
       <div class="row">
            <div class="col-md-6">{{textDescription}}</div>
            <div class="col-md-6">
                <nav>
                    <ul class="pagination justify-content-end">
                        <li class="item-go-page page-item item-start {{#if buttons.start.disabled}} disabled {{/if}}" data-page="{{buttons.start.page}}"><a href="javascript:void(0)"
                                class="page-link">{{buttons.start.text}}</a></li>


                        <li class="item-go-page page-item item-back {{#if buttons.back.disabled}} disabled {{/if}}" data-page="{{buttons.back.page}}" ><a href="javascript:void(0)" class="page-link">{{buttons.back.text}}</a></li>


                        {{#each buttons.pages}}
                                <li class="item-go-page page-item {{#if active}} active {{/if}} {{#if disabled}} disabled {{/if}}" data-page="{{page}}" ><a href="javascript:void(0)"
                                    class="page-link">{{text}}</a></li>         
                        {{/each}}

                        
                        <li class="item-go-page item-next  {{#if buttons.next.disabled}} disabled {{/if}}" data-page="{{buttons.next.page}}" ><a href="javascript:void(0)" class="page-link">{{buttons.next.text}}</a></li>

                        <li class="item-go-page item-end {{#if buttons.end.disabled}} disabled {{/if}}" data-page="{{buttons.end.page}}" ><a href="javascript:void(0)"
                                class="page-link">{{buttons.end.text}}</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </script>

    <script src="node_modules/jquery/dist/jquery.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
    <script src="node_modules/handlebars/dist/handlebars.js"></script>
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
        });
~~~

 
## Tech Stack  
**Client:** javascript, html, css

 
## License  
[MIT](https://choosealicense.com/licenses/mit/)  
