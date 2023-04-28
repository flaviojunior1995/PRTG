/* _Prtg.Table.js */
(function ($, window, document, undefined) {
    var pluginName = 'prtg-table';

    function prtgTable(element, data, parent) {
        this.data = data;
        this.el = (!(element instanceof jQuery)) ? element : element[0];
        this.$el = (!(element instanceof jQuery)) ? $(element) : element;
        this.parent = parent;
        this.$parent = $(parent);
        this.timer = this.$parent.Events();
        this.$refresh = this.$el.find('[refreshurl]');
        this.$form = this.$el.find('form');
        this.refreshurl = null;
        this.FilterToggle = _Prtg.Plugins['table-filter-toggle'];
        this.TicketsMenu = _Prtg.Plugins['tables-ticket-menu'];
        this.hasCheckboxes = this.$el.find('.tablemultiselectcheckbox').length > 0;

        if (this.$form.length) {
            this.refreshurl = this.$refresh.attr('refreshurl');
            this.params = _Prtg.Util.getUrlParameters(window.decodeURI(this.refreshurl));
            this.refreshurl = this.refreshurl.split('?')[0];
            this.initEvents();
            this.$form.attr('callerid', this.$form.attr('id'));
            this.enableSelectable(this.$el.find('tbody'));
            if (!this.params.tabletitle || this.params.tabletitle === 'AUTO') {
                var currentTableTitle = this.$el.find('.tabletitle th').text();
                if (currentTableTitle !== '') {
                    this.params.tabletitle = this.$el.find('.tabletitle th').text();
                }
            }
        }
        
        this.scrollEventHandler = (function() {
            this.repositionTableMenu();
        }).bind(this);

        if (!!this.data.sortable) this.sortable = this.$el.prtgsortable(data, parent, true)[0].refresh();
    }

    prtgTable.prototype.initEvents = function () {
        var self = this;

        if (!self.$refresh.data().hasOwnProperty('noAutoRefresh')) {
            this.timer.subscribe('refresh.events.prtg', null, self, self.refresh);
            this.timer.subscribeOnce('navigate.prtg', null, self, function (e) {
                self.timer.unsubscribe('refresh.events.prtg', self.refresh);
            });
        }

        this.$el.closest('#displaytable').off('click').on('click', 'tbody tr', function (event) {
            event.stopImmediatePropagation();
            _Prtg.objectTools.channelEditDialog($(this).find('.editchannelsettings').data().sensorid, $(this).find('.editchannelsettings').data().channelid);
        });

        if (self.hasCheckboxes) {
            this.$el.on('click', 'tbody.ui-selectable tr', function (event) {
                if ($(event.target).is('input, .favstar, .favempty, a, .actionbutton, .icon') || $(this).is('.notselectable')) return;
                var $this = $(this);
                var $tcheckbox = $this.find('.tablemultiselectcheckbox');
                var checked;

                if ($tcheckbox.length > 0) {
                    checked = $tcheckbox.prop('checked');
                    $tcheckbox.prop('checked', !checked);
                    if (checked) {
                        $this.removeClass('ui-selected');
                    } else {
                        $this.addClass('ui-selected');
                    }

                    self.updateMultiCheckbox();
                    self.updateTableMenu();
                }
            });
        }

        this.$el.find('#tagfilter').each(function () {
            var $elm = $(this);
            $elm.tagsinput({
                tags: function ($elm) {
                    $.getJSON('/api/usertags.json', function (data, status, xhr) {
                        self.tags = data.tags;
                        $elm.autocomplete({
                            source: self.tags
                        });
                    });
                }
            })
            .on('change', function (e) {
                var tags = this.value || null;
                tags = !!tags ? '@tag(' + tags + ')' : null;
                e.stopImmediatePropagation();
                $elm.trigger('changed', {
                    filters: [
                        {
                            name: 'filter_tags',
                            value: tags
                        },
                        {
                            name: 'tags',
                            value: this.value
                        },
                        {
                            name: 'start',
                            value: '0'
                        }
                    ]
                });
            });
        });

        this.$el.on('click.prtgtable tab.prtgtable', '.tablemenu a', {self: this}, self.handleTableMenu)
            .on('change.prtgtable', '.selectallasmultiedit', {self: this}, self.toggleSelectAll)
            .on('change.prtgtable', '.tablemultiselectcheckbox', {self: this}, self.selectColumn)
            .on('click.prtgtable', 'td.col-properties a', {self: this}, self.moreInfo)
            .on('click.prtgtable', '.tablebuttonbox .actionbutton', {self: this}, self.tablebuttonclickhandler)
            .on('change.prtgtable changed.prtgtable', 'div.sensorlookupnew,.select-reloadtablelink:not(.disabled),#tagfilter', $.proxy(self.reloadTableLink, this))
            .on('click.prtgtable', '.reloadtablelink:not(.disabled)', $.proxy(self.reloadTableLink, this))
            .on('destroyed', function () {
                _Prtg.Events.unsubscribe('datetimpicker.change', $.proxy(self.datetimepickerChangeHandler, self));
                _Prtg.Events.unsubscribe('newstats.prtg', $.proxy(self.datetimepickerChangeHandler, self));
                $(window).off('.prtgtable');
                $(document).off('.prtgtable');
                self.$el.off('.prtgtable');
            });

        if (!!self.data.tabletitle) {
            _Prtg.Events.subscribe('newstats.prtg', $.proxy(self.updateTableTitle, self));
        }

        _Prtg.Events.subscribe('datetimpicker.change', $.proxy(self.datetimepickerChangeHandler, self));
        _Prtg.Events.subscribe('loaded.events.prtg', $.proxy(self.afterRefresh, self));


        self.TicketsMenu.init(this.$el);
        self.FilterToggle.init(this.$el);
        self.initScrollTable(this.$el);
        self.bindHandleLabelClick();
        self.bindUpdateTableMenu();
        self.addTitleAttribute();
        self.updateTableAddPosition();
        self.FilterToggle.plugin.initialyOpenFilters(this.params);
    };

    prtgTable.prototype.bindHandleLabelClick = function (e) {
        this.$el.on('click', '.col-checkbox label' ,function (event) {
            var id = $(event.target).attr('for');
            $('input#' + id).click();
        });
    };

    prtgTable.prototype.initScrollTable = function () {
      var $el = this.$el;
      var $table = $el.find('table');

      if ($el.hasClass('scrollabletablecontainer')) {
        $table.floatThead('destroy');
        $table.floatThead({
          position: 'absolute',
          responsiveContainer: function ($el) {
            return $el.closest('form');
          },
          top: $('.js-header .menu-wrapper').outerHeight(),
          zIndex: 90
        });
        $el.find('.floatThead-container table').css('margin', 'auto');
      }
    };

    prtgTable.prototype.updateTableTitle = function (e) {
        this.params.tabletitle = this.data.tabletitle.printf(_Prtg.lastStats);
        this.$el.find('.tabletitle th>a').text(this.params.tabletitle);
        // self.addTitleAttribute();
    };

    prtgTable.prototype.addTitleAttribute = function (e){
        var $moveups = this.$el.find('tfoot.pagenavigation a.tablezoomlink, thead.pagenavigation span.table_itemcount_selector').detach(),
            $buttonbox = this.$el.siblings('.buttonbox');

        $buttonbox.find('a.tablezoomlink, span.table_itemcount_selector').remove();
        if($moveups.length > 0 && $buttonbox.length === 1)
            $buttonbox.prepend($moveups);
    };

    prtgTable.prototype.tablebuttonclickhandler = function (e) {
        $(this).append($('<div/>', {
            class: 'ajax-loader-small ajax-loader-small-inline'
        }));
    };

    prtgTable.prototype.moreInfo = function (e) {
        var $self = $(this);
        $self.parents('td').find('ul.property-list').toggleClass('hidden');
        $self.toggleClass('folded');
        $self.hasClass('folded') ? $self.text($self.data('hide')) : $self.text($self.data('show'));
    };

    prtgTable.prototype.datetimepickerChangeHandler = function (e) {
        var self = this;
        var update = false;
        var startpicker = this.$el.find('.table_datepicker_fromtodate input.table_datepicker_dstart.orginal_input');
        var endpicker = this.$el.find('.table_datepicker_fromtodate input.table_datepicker_dend.orginal_input');
        if (!startpicker.length && !endpicker.length) return;
        startpicker = startpicker.data('plugin_prtgDatetimepicker');
        endpicker = endpicker.data('plugin_prtgDatetimepicker');
        var startdate = startpicker.$el.val();
        var enddate = endpicker.$el.val();
        // self.$el.find('.pagenavigation ').first().addClass('ajax-loader-small');

        if (this.params['filter_drel']) {
            update = true;
            delete this.params['filter_drel'];
        }

        if (!!startdate) {
            update = true;
            this.params['filter_dstart'] = startdate;
        } else {
            update = update || this.params.hasOwnProperty('filter_dstart');
            delete this.params['filter_dstart'];
        }

        if (!!enddate) {
            update = true;
            this.params['filter_dend'] = enddate;
        } else {
            update = update || this.params.hasOwnProperty('filter_dend');
            delete this.params['filter_dend'];
        }

        if (update) {
            delete this.params['start'];
            this.refresh({data: this}, true);
        }
    };

    prtgTable.prototype.reloadTableLink = function (e, filter) {
        var self = this;
        var data;
        var force = true;
        // self.$parent.find('.buttonbox .table_itemcount_selector ').addClass('ajax-loader-small');
        if (e.type === 'change') {
            data = $(e.target).find(':selected').data().reload;
        } else if (e.type === 'changed') {
            data = filter.filters;
        } else {
            e.preventDefault();
            if ($(e.target).is('.ui-icon,i')) {
                data = $(e.target).parent('a').data().reload;
            } else {
            	if($(e.target).parent().is('.table_itemcount_selector')){
            		$(e.target).parent().find('.reloadtablelink.selected').removeClass('selected');
            		$(e.target).addClass('selected');
            		force = false;
            	}
              data = $(e.target).data().reload;
            }
        }

        if (!!data)
            $.each(data, function () {
                if (this.value === null && self.params.hasOwnProperty(this.name))
                    delete self.params[this.name];
                else
                    self.params[this.name] = this.value;
            });
        this.refresh({data: this}, force);
    };

    prtgTable.prototype.refresh = function (e, force) {
        var prtgTable = e.data;
        var nothingIsSelected = prtgTable.$el.find('.tablemultiselectcheckbox:checked').length === 0;
        var itemSelectorData = prtgTable.$el.find('.table_itemcount_selector a.selected').data()||{};
        var isBelowItemTreshold = true;

        if(itemSelectorData.reload) {
          isBelowItemTreshold = itemSelectorData.reload[0].value < 1000 || prtgTable.$el.find('tbody tr').length <= 500;
        }

        if (e.force || force || (nothingIsSelected && isBelowItemTreshold)) {
            $.ajax({
                url: prtgTable.refreshurl,
                data: prtgTable.params
            }).done(function (data) {
								var $data = $($.parseHTML(data));
								var $table = $data.find('table.table');
                // prtgTable.disableSelectable();
                prtgTable.$refresh = $data.find('[refreshurl]').attr('refreshurl');
                prtgTable.$el.find('[refreshurl]').attr('refreshurl', prtgTable.$refresh);

                prtgTable.enableSelectable($table.find('tbody'));

                _Prtg.initPlugins(prtgTable.$el.find('table.table').html($table.contents()));
                _Prtg.Events.publish('loaded.events.prtg', prtgTable.$el);
            });
        }
    };

    prtgTable.prototype.afterRefresh = function afterRefresh(e){
    	  var prtgTable = this;
	        !!prtgTable.sortable && prtgTable.sortable.refresh();
	        prtgTable.updateTableMenu();
	        prtgTable.initScrollTable();
    };

    prtgTable.prototype.handleTableMenu = function (e) {

        var $this = $(this),
            me = this,
            self = e.data.self,
            action = $this.data('action') || '',
            filter = (/^ack/.test(action) == true ? '[status="5"]' : ''),
            selected = e.data.self.$el.find('.tablemultiselectcheckbox' + filter + ':checked').not('.selectallasmultiedit'),
            ids = [];

        if (selected.is('[data-status]')) {
            selected.each(function () {
                ids.push({objid: $(this).val(), status: $(this).attr('data-status')});
            });
        } else {
            selected.each(function () {
                ids.push($(this).val());
            });
        }

        function refresh() {
            self.refresh({data: self, force: true});
        }
        function closemenu(e){
        		$this.closest('.tablemenu').addClass('invisible');
        }

        if (action === 'stop') {
            _Prtg.objectTools.pauseObject.call(me, ids, 0).always(closemenu);
			
			
			
			
			
			
        } else if (action === 'resume') {
            _Prtg.objectTools.pauseObject(ids.join(','), 1).always(closemenu);
        } else if (action === 'checknow') {
            _Prtg.objectTools.checkObjectNow(ids.join(',')).always(closemenu);
        } else if (action === 'delete') {
            _Prtg.objectTools.deleteObject(ids, true)
	            .done(function(){
                    closemenu()
	                $('#' + ids.join(',#')).filter('a').closest('tr').remove();
	            });
        } else if (action === 'clone') {
            _Prtg.objectTools.duplicateObject.call(me, ids);


        } else if (action === 'ackfor') {
            _Prtg.objectTools.acknowledgeError.call(me, ids.join(','), $this.data('ackfor'));





        } else if (action === 'prio') {
            _Prtg.objectTools.setObjectPriority(ids.join(','), $this.data('prio'));
        } else if (action === 'addfav') {
            _Prtg.objectTools.faveObject(ids.join(','), 1);
        } else if (action === 'removefav') {
            _Prtg.objectTools.faveObject(ids.join(','), 0);
        } else if (action === 'edit') {
            if (ids.length) _Prtg.objectTools.editSettingsDialog('/multiedit.htm', ids.join(','), {});
        } else if (action === 'move') {
            _Prtg.objectTools.setObjectPosition.call(me, ids.join(','), $this.data('move'));
        } else if (action === 'discover') {
            _Prtg.objectTools.discoverObjectNow.call(me, ids.join(','));
        } else if (action === 'autodiscovertemplate') {
          _Prtg.objectTools.discoverObjectTemplate.call(me, ids);
        } else if (action === 'maprotation') {
            window.location.replace('/mapshow.htm?ids=' + ids.join(','));


        } else if (action === 'ticket-new') {
            _Prtg.objectTools.ticketAdd.call(me, 'new');
        } else if (action === 'ticket-edit') {
            _Prtg.objectTools.ticketEdit.call(me, ids);
        } else if (action === 'ticket-assign') {
            _Prtg.objectTools.ticketAssign.call(me, ids);
        } else if (action === 'ticket-resolve') {
            _Prtg.objectTools.ticketResolve.call(me, ids);
        } else if (action === 'ticket-close') {
            _Prtg.objectTools.ticketClose.call(me, ids);
        } else if (action === 'ticket-reopen') {
            _Prtg.objectTools.ticketReopen.call(me, ids);
        } else if (action === 'ticket-prio') {
            _Prtg.objectTools.ticketPriority.call(me, ids, $this.data('prio'));
        } else if (action === 'noti-test') {
            _Prtg.objectTools.testNotification(ids);
        } else if (action == 'usedby'){
            _Prtg.objectTools.usedbyObject(ids);
        }

        return false;
    };

    prtgTable.prototype.toggleSelectAll = function (e) {
        var self = e.data.self;
        if (!$(this).prop('checked')) {
            self.$el.find('.tablemultiselectcheckbox').prop('checked', false);
            self.$el.find('.ui-selected').removeClass('ui-selected');
        } else {
            self.$el.find('.tablemultiselectcheckbox').prop('checked', true).closest('tr').addClass('ui-selected');
        }

        self.updateTableMenu();
    };

    prtgTable.prototype.updateMultiCheckbox = function () {
        var $multicheckbox = this.$el.find('.selectallasmultiedit');
        var $checkboxes = this.$el.find('.ui-selectee');
        var $selectedcheckboxes = $checkboxes.filter('.ui-selected');

        if ($checkboxes.length === $selectedcheckboxes.length) {
            $multicheckbox.prop('checked', true).closest('tr').addClass('ui-selected');
        } else {
            $multicheckbox.prop('checked', false).closest('tr').removeClass('ui-selected');
        }
    };

    prtgTable.prototype.disableSelectable = function disableSelectable() {
        var prtgTable = this;
        if (!prtgTable.hasCheckboxes) {
            prtgTable.$el.find('tbody.selectable-initialized').removeClass('selectable-initialized').selectable('destroy');
        }
    }
    prtgTable.prototype.enableSelectable = function ($selectable) {
        var prtgTable = this;

        // necessary for e.g. sysinfo so sb. can copy text
        if(!prtgTable.hasCheckboxes)
             return;

        $selectable.selectable({
            start: function () {
                prtgTable.$el.find('.selectallasmultiedit').prop('checked', false);
            },

            stop: function () {
                prtgTable.updateTableMenu();
            },

            selecting: function (event, ui) {
                $(ui.selecting).find('.tablemultiselectcheckbox').prop('checked', true);
            },

            unselecting: function (event, ui) {
                $(ui.unselecting).find('.tablemultiselectcheckbox').prop('checked', false);
            },

            selected: function (event, ui) {
                $(ui.selected).find('.tablemultiselectcheckbox').prop('checked', true);
            },
            distance: 15,
            filter: 'tr:not(.notselectable)',
            cancel: 'a, input, option, .notselectable, .detailpageoverview>tr, .tablewithstyles, .sorter'
        }).addClass('selectable-initialized');
    };

    prtgTable.prototype.selectColumn = function (e) {
        var $this = $(this);
        if ($this.hasClass('selectallasmultiedit')) return;
        if ($this.is(':checked')) {
            $this.closest('tr').addClass('ui-selected');
        } else {
            $this.closest('tr').removeClass('ui-selected');
        }
        e.data.self.updateMultiCheckbox();
        e.data.self.updateTableMenu();
    };

    prtgTable.prototype.updateTableAddPosition = function () {        
        var container = $('.js-fixedtableadd');
        container.attr('style','');

        if (container && container.length > 0) {
            var tableRightPos = $(document).outerWidth() -  (container.offset().left + container.outerWidth());
            container.css({
                'position': 'fixed',
                'top': container.offset().top,
                'right': tableRightPos + 'px',
                'left': 'auto'
            });
        }
    };

    prtgTable.prototype.updateTableMenu = function () {
        var $menu = this.$el.find('.js-fixedtablemenu .jd_menu')
          , container = $menu.parent()
          , $checked = this.$el.find('.tablemultiselectcheckbox:checked').not('#selectall_2_notificationtable');
        if ($checked.length > 0) {            
            if (this.TicketsMenu.plugin.isTicketTable) {
                this.TicketsMenu.plugin.filterMenu($checked, $menu);
            }
            // Init for moving table menu
            $(window).on('scroll', this.scrollEventHandler)
            this.repositionTableMenu();           

            if ($checked.length >  1) {
                $menu.find('li[single]').hide();
            }
            else {
                $menu.find('li[single]').show();
            }

            if(container.hasClass('invisible')) {
                container.removeClass('invisible');                
            }

            if (this.$el.find('.tablemultiselectcheckbox[status="5"]:checked').length === 0) {
                $menu.find('[ack]').hide();
            } else {
                $menu.find('[ack]').show();
            }
        } else {
            $menu.removeClass('flyoutleft').parent().addClass('invisible');                                
            
            // Resets for moving table menu
            this.scrollTimer = null;
            $(window).off('scroll', this.scrollEventHandler);
            if(container[0]) {
                container[0].style.transform = '';
            }
        }
    };    

    prtgTable.prototype.repositionTableMenu = function() {        
        var self = this;
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(function() {            
            var tableMenu = self.$el.find('.tablemenu')[0];                                            

            var translateY = '';
            if(self.$el[0].getBoundingClientRect().top < 0) {                       
                // Use window.parseInt, because IE does not support Number.parseInt
                var maxOffset = self.$el[0].offsetHeight - tableMenu.offsetHeight - window.parseInt(window.getComputedStyle(tableMenu).top);                            
                var tableOffset = Math.min(Math.abs(self.$el[0].getBoundingClientRect().top), maxOffset);
                translateY = 'translateY(' + tableOffset + 'px)';
            }
            tableMenu.style.transform = translateY;
        }, 250);        
    }    

    prtgTable.prototype.bindUpdateTableMenu = function () {        
    	var  self = this;
        $(window).debounce(function () {						
		    self.updateTableAddPosition();
        }, 250);
    };

    _Prtg.Plugins.registerPlugin(pluginName, prtgTable);

})(jQuery, window, document);
