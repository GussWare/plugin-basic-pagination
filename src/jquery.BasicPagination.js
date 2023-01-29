(function ($) {
    $.fn.BasicPagination = function (options) {
        var settings = $.extend({
            apiUrl: '/api/data',
            tableId: 'basic-pagination-table',
            templateId: 'basic-template-row',
            pagesContainerClass: 'basic-pages-container',
            pagination: {
                results: "results",
                maxBtnPagination: 6,
                textStart: "Inicio",
                textBack: "Atras",
                textNext: "Siguiente",
                textEnd: "Fin",
                textPagination: "Mostrando {0} resultados de {1} resgistros."
            },
        }, options);

        var $table = $('#' + settings.tableId);
        var $template = $('#' + settings.templateId);
        var $paginationContainer = $('.' + settings.pagesContainerClass);

        var currentPage = 1;
        var rowsPerPage = 10;
        var totalPages = 0;
        var data = {};
        var isFilter = false;

        function getTableHeaders() {
            var headers = [];
            $table.find('th').each(function () {
                headers.push($(this).data('name'));
            });
            return headers;
        }

        function renderTable(data) {
            var headers = getTableHeaders();
            var rows = '';
            var compiledTemplate = Handlebars.compile($template.html());

            $.each(data, function (index, item) {
                var row = {};
                $.each(headers, function (index, header) {
                    row[header] = item[header];
                });
                rows += compiledTemplate(row);
            });

            $table.find('tbody').html(rows);
        }

        function createPagination(currentPage, totalPages, totalRegister, totalResults, limit) {

            var pageBack = null;
            var pageNext = null;
            var numButtons = Math.floor(settings.pagination.maxBtnPagination / 2);
            var disableBtnBack = false;
            var disableBtnNext = false;
            var activeBtnBack = false;
            var activeBtnNext = false;

            if (currentPage === 1 && currentPage === totalPages) {
                pageBack = 1;
                pageNext = 1;

                disableBtnBack = true;
                disableBtnNext = true;

            } else if (currentPage > 1 && currentPage === totalPages) {
                pageBack = totalPages - settings.pagination.maxBtnPagination;

                if (pageBack < 1) {
                    pageBack = 1;
                }

                pageNext = totalPages;

                disableBtnBack = false;
                disableBtnNext = true;

            } else if (currentPage >= 1 && currentPage <= totalPages) {
                pageBack = currentPage - numButtons;
                pageNext = currentPage + numButtons;

                if (pageBack < 1) {
                    pageBack = 1;
                }

                if (pageNext > totalPages) {
                    pageNext = totalPages;
                }

                disableBtnBack = false;
                disableBtnNext = false;
            }

            $.each($paginationContainer, function (key, pagination) {

                var row = $("<div>").addClass("row");
                row.appendTo(pagination);

                var divContainerDesc = $("<div>").addClass("col-md-6");
                var divContainerPages = $("<div>").addClass("col-md-6");

                divContainerDesc.text(textPagination(totalRegister, totalResults, limit)).appendTo(row);
                divContainerPages.appendTo(row);

                var nav = $("<nav>");
                nav.appendTo(divContainerPages);


                //Boton Inicio
                var ulPagesContainer = $("<ul></ul>").addClass("pagination justify-content-end");
                ulPagesContainer.appendTo(nav);

                var btnStart = makeLi(settings.pagination.textStart, 1, false, disableBtnBack, 'item-go-page item-start');
                btnStart.appendTo(ulPagesContainer);

                var btnBack = makeLi(settings.pagination.textBack, null, false, disableBtnBack, 'item-back');
                btnBack.appendTo(ulPagesContainer);

                var btnPages = null;
                var disableBtn = false;
                for (var i = pageBack; i <= pageNext; i++) {
                    disableBtn = (parseInt(currentPage) === parseInt(i));

                    btnPages = makeLi(i, i, disableBtn, disableBtn, 'item-go-page');
                    btnPages.appendTo(ulPagesContainer);
                }

                var btnNext = makeLi(settings.pagination.textNext, null, false, disableBtnNext, 'item-next');
                btnNext.appendTo(ulPagesContainer);

                var btnEnd = makeLi(settings.pagination.textEnd, totalPages, false, disableBtnNext, 'item-go-page item-end');
                btnEnd.appendTo(ulPagesContainer);

            });
        }

        function makeLi(text, page, active, disabledBtn, css) {
            var li = $("<li></li>")
                .addClass("page-item");

            if (page) {
                li.attr("data-page", page);
            }

            if (active) {
                li.addClass("active");
            }

            if (disabledBtn) {
                li.addClass("disabled");
            }

            if (css) {
                li.addClass(css);
            }

            var btn = $("<a></a>")
                .attr("href", "javascript:void(0)")
                .addClass("page-link")
                .text(text);

            btn.appendTo(li);

            return li;
        }

        function textPagination(totalRegister, totalResults, limit) {
            var text = settings.pagination.textPagination;

            if (isFilter) {
                text = text.replace('{0}', totalRegister);
                text = text.replace('{1}', totalResults);
            } else {
                text = text.replace('{0}', limit);
                text = text.replace('{1}', totalResults);
            }

            return text;
        }

        function getData() {
            $.ajax({
                url: settings.apiUrl,
                dataType: 'json',
                success: function (response) {
                    renderTable(response.results);
                    createPagination(response.page, response.totalPages, response.totalRegister, response.totalResults, response.limit);
                }
            });
        }

        getData();

        $paginationContainer.on('click', 'a', function (e) {
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
