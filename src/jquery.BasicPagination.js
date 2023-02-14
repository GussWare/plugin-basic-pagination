(function ($) {
    $.fn.BasicPagination = function (options) {
        var settings = $.extend({
            paginationId: 'basic-pagination-table',
            templateId: 'basic-template-row',
            paginationTemplateId: 'basic-pages-template',
            pagesContainerClass: 'basic-pages-container',
            serverSide: {
                apiUrl: '/api/pagination',
                method: "GET",
                dataType: "json",
                timesleep: 1000,
                advancedSearch: null,
                extraData: null,
                fnEventsCallback: function(){}
            },
            pagination: {
                results: "results",
                maxBtnPagination: 6,
                textStart: "Inicio",
                textBack: "Atras",
                textNext: "Siguiente",
                textEnd: "Fin",
                textPagination: "Mostrando {0} resultados de {1} resgistros.",
                classButtonAction: ".item-go-page"
            },
        }, options);

        var $basicPagination = $('#' + settings.paginationId);
        var $template = $('#' + settings.templateId);
        var $paginationContainer = $('.' + settings.pagesContainerClass);

        var currentPage = 1;
        var rowsPerPage = 10;
        var totalPages = 0;
        var data = {};
        var isFilter = false;

        function getTableHeaders() {
            var headers = [];
            $basicPagination.find('th').each(function () {
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

            $basicPagination.find('tbody').html(rows);
        }

        function createPagination(currentPage, totalPages, totalRegister, totalResults, limit) {
            var btnBack = null;
            var btnNext = null;
            var pageBack = null;
            var pageNext = null;
            var disableBtnBack = false;
            var disableBtnNext = false;
            var numButtons = Math.floor(settings.pagination.maxBtnPagination / 2);

            if (currentPage === 1 && currentPage === totalPages) {
                btnBack = 1;
                btnNext = 1;

                disableBtnBack = true;
                disableBtnNext = true;

            } else if (currentPage > 1 && currentPage === totalPages) {
                btnBack = totalPages - settings.pagination.maxBtnPagination;

                if (btnBack < 1) {
                    btnBack = 1;
                }

                btnNext = totalPages;

                disableBtnBack = false;
                disableBtnNext = true;

            } else if (currentPage >= 1 && currentPage <= totalPages) {
                btnBack = currentPage - numButtons;
                btnNext = currentPage + numButtons;

                if (btnBack < 1) {
                    btnBack = 1;
                }

                if (btnNext > totalPages) {
                    btnNext = totalPages;
                }

                disableBtnBack = false;
                disableBtnNext = false;
            }

            pageBack = currentPage - 1;

            if (pageBack < 1) {
                pageBack = 1;
            }

            pageNext = currentPage + 1;

            if(pageNext > totalPages) {
                pageNext = totalPages;
            }

            $paginationContainer.html('')

            var paginationButtons = {
                textDescription: textPagination(totalRegister, totalResults, limit),
                buttons: {
                    start: {
                        text: settings.pagination.textStart,
                        page: 1,
                        active: disableBtnBack,
                        enabled: disableBtnBack,
                    },
                    back: {
                        text: settings.pagination.textBack,
                        page: pageBack,
                        active: disableBtnBack,
                        enabled: disableBtnBack,
                    },
                    pages: [],
                    next: {
                        text: settings.pagination.textNext,
                        page: pageNext,
                        active: disableBtnNext,
                        enabled: disableBtnNext,
                    },
                    end: {
                        text: settings.pagination.textEnd,
                        page: totalPages,
                        active: disableBtnNext,
                        enabled: disableBtnNext,
                    }
                }
            };

            for (var i = btnBack; i <= btnNext; i++) {
                disableBtn = (parseInt(currentPage) === parseInt(i));

                paginationButtons.buttons.pages.push({
                    text: i,
                    page: i,
                    active: disableBtn,
                    enabled: disableBtn,
                    class: "item-go"
                });
            }

            var $paginationTemplate = $('#' + settings.paginationTemplateId);
            var compiledTemplate = Handlebars.compile($paginationTemplate.html());
            var paginationButtonsCompiled = compiledTemplate(paginationButtons);

            $paginationContainer.html(paginationButtonsCompiled);

            observerPagination();
        }

        function observerPagination() {
            var btnGoPage = $paginationContainer.find(settings.pagination.classButtonAction);

            btnGoPage.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                currentPage = $(this).data("page");

                callServerSide(currentPage);
            });
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

        function callServerSide(page) {
            $.ajax({
                url: settings.serverSide.apiUrl,
                data: getData(page),
                dataType: settings.serverSide.dataType,
                method: settings.serverSide.method,
                success: function (response) {
                    renderTable(response.results);
                    createPagination(response.page, response.totalPages, response.totalRegister, response.totalResults, response.limit);

                    settings.serverSide.fnEventsCallback($basicPagination);
                }
            });
        }

        function getData(page) {
            var data = {};

            if (settings.serverSide.advancedSearch instanceof Function) {
                data = settings.serverSide.advancedSearch.call(this);
            } else {
                $.each(settings.serverSide.advancedSearch, function (key, form) {
                    let { name, value } = $(form).serializeArray();
                    data[name] = value;
                });
            }

            if (page) {
                currentPage = page;
            } else {
                currentPage = 1;
            }

            data.page = currentPage;

            if (settings.serverSide.extraData instanceof Function) {
                var extraData = settings.serverSide.extraData.call(this);

                $.each(extraData, function (key, value) {
                    data[key] = value;
                });
            }

            return data;
        }

        callServerSide();


        // retornamos metodos publicos que necesitemos
        this.callServerSide = callServerSide;

        return this;
    };
}(jQuery));
