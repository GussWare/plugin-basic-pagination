(function($) {
    $.fn.BasicPagination = function(options) {
        var settings = $.extend({
            apiUrl: '/api/data',
            tableId: 'basic-pagination-table',
            templateId: 'basic-template-row',
            pagesContainerClass: 'basic-pages-container'
        }, options);
        
        var $table = $('#' + settings.tableId);
        var $template = $('#' + settings.templateId);
        var $paginationContainer = $('.' + settings.pagesContainerClass);
        
        var currentPage = 1;
        var rowsPerPage = 10;
        var totalPages = 0;
        var data = {};

        function getTableHeaders() {
            var headers = [];
            $table.find('th').each(function() {
                headers.push($(this).data('name'));
            });
            return headers;
        }

        function renderTable(data) {
            var headers = getTableHeaders();
            var rows = '';
            var compiledTemplate = Handlebars.compile($template.html());

            $.each(data, function(index, item) {
                var row = {};
                $.each(headers, function(index, header) {
                    row[header] = item[header];
                });
                rows += compiledTemplate(row);
            });
            
            $table.find('tbody').html(rows);
        }
        
        function createPagination(currentPage, totalPages) {
            var pagination = '<ul>';
            for (var i = 1; i <= totalPages; i++) {
                pagination += '<li><a href="#" data-page="' + i + '">' + i + '</a></li>';
            }
            pagination += '</ul>';
            $paginationContainer.html(pagination);
        }

        function getData() {
            $.ajax({
                url: settings.apiUrl,
                dataType: 'json',
                success: function(response) {
                    renderTable(response.results);
                    createPagination(response.page, response.totalPages);
                }
            });
        }

        getData();

        $paginationContainer.on('click', 'a', function(e) {
            e.preventDefault();
            var page = $(this).data('page');
            if (page != currentPage) {
                currentPage = page;
                renderTable(data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
            }
        });

        return this;
    };
}(jQuery));
