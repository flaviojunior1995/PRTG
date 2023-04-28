

(function(yesorno) {
	var dialogs = yesorno;
  var myobject = null;
	var self = {
		bindings: {
			/**************************************************/
			/** Contextmenu for sensors **/
			/**************************************************/
			"sensordetail": function (t) { _Prtg.Hjax.loadLink.call(t,"/sensor.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=1"); },
			"sensoredit": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, '/multiedit.htm', {id:(t.attr('data-id')||t.attr('id')),objecttype:'sensor'}); },
			"sensorrename": function (t) { self.setWorkingClass(t); _Prtg.objectTools.quickeditObject.call(t, (t.attr('data-id')||t.attr('id')), 1).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensornotifications": function (t) { _Prtg.Hjax.loadLink("/sensor.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=9"); },
			"sensorgraph0": function (t) { _Prtg.Hjax.loadLink.call(t,"/sensor.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=2"); },
			"sensorgraph1": function (t) { _Prtg.Hjax.loadLink.call(t,"/sensor.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=3"); },
			"sensorgraph2": function (t) { _Prtg.Hjax.loadLink.call(t,"/sensor.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=4"); },
			"sensorgraph3": function (t) { _Prtg.Hjax.loadLink.call(t,"/sensor.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=5"); },
			"sensorclone": function (t) { _Prtg.objectTools.cloneObject.apply(t,[(t.attr('data-id')||t.attr('id')),'sensor', true]); },
			"sensoracknowledge": function (t) { },
			"sensoracknowledgenow": function (t) { self.setWorkingClass(t); _Prtg.objectTools.acknowledgeError.call(t,(t.attr('data-id')||t.attr('id')), undefined,this).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensoracknowledgefor5": function (t) { self.setWorkingClass(t); _Prtg.objectTools.acknowledgeError.call(t,(t.attr('data-id')||t.attr('id')), 5, this).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensoracknowledgefor15": function (t) { self.setWorkingClass(t); _Prtg.objectTools.acknowledgeError.call(t,(t.attr('data-id')||t.attr('id')), 15,this).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensoracknowledgefor60": function (t) { self.setWorkingClass(t); _Prtg.objectTools.acknowledgeError.call(t,(t.attr('data-id')||t.attr('id')), 60,this).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensoracknowledgefor180": function (t) { self.setWorkingClass(t); _Prtg.objectTools.acknowledgeError.call(t,(t.attr('data-id')||t.attr('id')), 180,this).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensoracknowledgefor1440": function (t) { self.setWorkingClass(t); _Prtg.objectTools.acknowledgeError.call(t,(t.attr('data-id')||t.attr('id')), 1440,this).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensoracknowledgeuntil": function (t) { self.setWorkingClass(t); _Prtg.objectTools.acknowledgeErrorUntil.call(t,(t.attr('data-id')||t.attr('id'))).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"sensorhistoric": function (t) { _Prtg.Hjax.loadLink.call(t,"/sensor.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=6"); },
			"sensorsendlinkpermail": function (t) { window.top.location.href = self.buildMailtoLink(t,"sensor"); },

			/**************************************************/
			/** Contextmenu for devices **/
			/**************************************************/
			"devicedetail": function (t) { _Prtg.Hjax.loadLink("/device.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"deviceaddsensor": function (t) { window.top.location.href = "/addsensor.htm?id=" + (t.attr('data-id')||t.attr('id')); },
			"deviceedit": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, '/multiedit.htm', {id:(t.attr('data-id')||t.attr('id')),objecttype:'device'}); },
			"devicerename": function (t) { self.setWorkingClass(t); _Prtg.objectTools.quickeditObject.call(t, (t.attr('data-id')||t.attr('id')), 2).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"recommendnow": function (t) { _Prtg.objectTools.recommendNow.apply(t, [(t.attr('data-id')||t.attr('id'))]); },
			"devicenotifications": function (t) { _Prtg.Hjax.loadLink("/device.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=8"); },
			"devicegraph1": function (t) { _Prtg.Hjax.loadLink("/device.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=2"); },
			"devicegraph2": function (t) { _Prtg.Hjax.loadLink("/device.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=3"); },
			"devicegraph3": function (t) { _Prtg.Hjax.loadLink("/device.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=4"); },
			"deviceclone": function (t) { if(dialogs) _Prtg.objectTools.cloneObject.apply(t,[(t.attr('data-id')||t.attr('id')),'device']); else  _Prtg.Hjax.loadLink("/duplicatedevice.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"devicemove": function (t) { _Prtg.objectTools.moveObject.apply(t, [(t.attr('data-id')||t.attr('id'))]); },
			"devicerdp": function (t) { _Prtg.objectTools.windows.openRDPWindow((t.attr('data-id')||t.attr('id')), "http"); },
			"openvnc": function (t) { _Prtg.objectTools.windows.openVNCWindow((t.attr('data-id')||t.attr('id')), "http"); },
			"openssh": function (t) { _Prtg.objectTools.windows.openSSHWindow((t.attr('data-id')||t.attr('id')), "http"); },
			"opentelnet": function (t) { _Prtg.objectTools.windows.openTelnetWindow((t.attr('data-id')||t.attr('id')), "http"); },
			"openhttp": function (t) { _Prtg.objectTools.windows.openWindow((t.attr('data-id')||t.attr('id')), "http"); return false; },
			"openhttps": function (t) { _Prtg.objectTools.windows.openWindow((t.attr('data-id')||t.attr('id')), "https"); },
			"serviceurl": function (t) { _Prtg.objectTools.windows.openServiceURLWindow((t.attr('data-id')||t.attr('id'))); },
			"openftp": function (t) { _Prtg.objectTools.windows.openWindow((t.attr('data-id')||t.attr('id')), "ftp"); },
			"devicetracert": function (t) { _Prtg.objectTools.windows.traceRoute((t.attr('data-id')||t.attr('id'))); },
			"devicecreatetemplate": function (t) { _Prtg.objectTools.createTemplate.apply(t,[(t.attr('data-id')||t.attr('id'))]);},
			"devicefindduplicates": function (t) { _Prtg.objectTools.findDuplicates.apply(t,[(t.attr('data-id')||t.attr('id'))]);},
			"devicesendlinkpermail": function (t) { window.top.location.href = self.buildMailtoLink(t,"device"); },
			"deviceinstallprobe": function (t) { window.top.location.href="/deviceprobeinstall.htm?id=" + (t.attr('data-id')||t.attr('id')); },

			/**************************************************/
			/** Contextmenu for libraries  **/
			/**************************************************/
			"libdetail": function (t) { _Prtg.Hjax.loadLink("/library.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"libaddnode": function (t) { _Prtg.objectTools.addObject.apply(t, ['new', "library",{'linkedid_': 0, 'targetid': (t.attr('data-id')||t.attr('id')||_Prtg.Util.getUrlVars()['id']), 'addid':(t.attr('data-id')||t.attr('id'))}]); },
			"libaddlib": function (t) {/*dummy*/ },
			"libedit": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, '/multiedit.htm', {id:(t.attr('data-id')||t.attr('id')),objecttype:'library'}); },
			"libmanage": function (t) { _Prtg.Hjax.loadLink("/library.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=2"); },
			"librename": function (t) { self.setWorkingClass(t); _Prtg.objectTools.quickeditObject.call(t, (t.attr('data-id')||t.attr('id')), 3).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"libsendlinkpermail": function (t) { window.top.location.href = self.buildMailtoLink(t, "library"); },
			"libobjectdetail": function (t) { _Prtg.Hjax.loadLink("/libraryobject.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"libobjectedit": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, '/multiedit.htm', {id:(t.attr('data-id')||t.attr('id')),objecttype:'library'}); },
			"libdodelete": function (t) { _Prtg.objectTools.deleteObject.apply(t,[(t.attr('data-id')||t.attr('id')),!!t.closest('[callerid]').andSelf().attr('callerid')]); },

			/**************************************************/
			/** Contextmenu for Groups  **/
			/**************************************************/
			"groupdetail": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"groupadddevice": function (t) { _Prtg.objectTools.addObject.apply(t, [(t.attr('data-id')||t.attr('id')), "device"]); },
			"groupaddgroup": function (t) {  _Prtg.objectTools.addObject.apply(t, [(t.attr('data-id')||t.attr('id')), "group"]); },
			"groupaddautogroup": function (t) { _Prtg.objectTools.addObject.apply(t, [(t.attr('data-id')||t.attr('id')), "autodiscovery"]); },
			"groupedit": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, '/multiedit.htm', {id:(t.attr('data-id')||t.attr('id')),objecttype:'group'}); },
			"grouprename": function (t) { self.setWorkingClass(t); _Prtg.objectTools.quickeditObject.call(t, (t.attr('data-id')||t.attr('id')), 3).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"groupnotifications": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=9"); },
			"groupgraph1": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=2"); },
			"groupgraph2": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=3"); },
			"groupgraph3": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=4"); },
			"groupclone": function (t) { if(dialogs) _Prtg.objectTools.cloneObject.apply(t,[(t.attr('data-id')||t.attr('id')),'group']); else  _Prtg.Hjax.loadLink("/duplicategroup.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"groupmove": function (t) { _Prtg.objectTools.moveObject.apply(t, [(t.attr('data-id')||t.attr('id'))]); },
			"groupmanage": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=7"); },
			"groupsendlinkpermail": function (t) { window.top.location.href = self.buildMailtoLink(t,"group"); },

			/**************************************************/
			/** Contextmenu for the root group  **/
			/**************************************************/
			"rootgroupdetail": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"rootgroupedit": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, '/multiedit.htm', {id:(t.attr('data-id')||t.attr('id')),objecttype:'group'}); },
			"rootgroupmanage": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=7"); },
			"rootgrouprename": function (t) { self.setWorkingClass(t); _Prtg.objectTools.quickeditObject.call(t, (t.attr('data-id')||t.attr('id')), 4).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"rootgroupnotifications": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=9"); },
			"rootgroupgraph1": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=2"); },
			"rootgroupgraph2": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=3"); },
			"rootgroupgraph3": function (t) { _Prtg.Hjax.loadLink("/group.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=4"); },
			"rootsendlinkpermail": function (t) { window.top.location.href = self.buildMailtoLink(t,"group"); },

			/**************************************************/
			/** Contextmenu for Probes  **/
			/**************************************************/
			"probedetail": function (t) { _Prtg.Hjax.loadLink("/probenode.htm?id=" + (t.attr('data-id')||t.attr('id'))); },
			"probeadddevice": function (t) { _Prtg.objectTools.addObject.apply(t, [(t.attr('data-id')||t.attr('id')), "device"]); },
			"probeaddgroup": function (t) { _Prtg.objectTools.addObject.apply(t, [(t.attr('data-id')||t.attr('id')), "group"]); },
			"probeaddautogroup": function (t) { _Prtg.objectTools.addObject.apply(t, [(t.attr('data-id')||t.attr('id')), "autodiscovery"]); },
			"probeedit": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, '/multiedit.htm', {id:(t.attr('data-id')||t.attr('id')),objecttype:'probenode'}); },
			"proberename": function (t) { self.setWorkingClass(t); _Prtg.objectTools.quickeditObject.call(t, (t.attr('data-id')||t.attr('id')), 4).fail(function(){self.unsetWorkingClass(t);}); return false; },
			"probenotifications": function (t) { _Prtg.Hjax.loadLink("/probenode.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=9"); },
			"probegraph1": function (t) { _Prtg.Hjax.loadLink("/probenode.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=2"); },
			"probegraph2": function (t) { _Prtg.Hjax.loadLink("/probenode.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=3"); },
			"probegraph3": function (t) { _Prtg.Hjax.loadLink("/probenode.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=4"); },
			"probemanage": function (t) { _Prtg.Hjax.loadLink("/probenode.htm?id=" + (t.attr('data-id')||t.attr('id')) + "&tabid=7"); },
			"probesendlinkpermail": function (t) { window.top.location.href = self.buildMailtoLink(t,"probenode"); },

			/**************************************************/
			/** Contextmenu for Moving Objects  **/
			/**************************************************/
			"movetop": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPosition.apply(t, [(t.attr('data-id')||t.attr('id')), "top"]).then(function(){self.unsetWorkingClass(t);}); },
			"moveup": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPosition.apply(t, [(t.attr('data-id')||t.attr('id')), "up"]).then(function(){self.unsetWorkingClass(t);}); },
			"movedown": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPosition.apply(t, [(t.attr('data-id')||t.attr('id')), "down"]).then(function(){self.unsetWorkingClass(t);}); },
			"movebottom": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPosition.apply(t, [(t.attr('data-id')||t.attr('id')), "bottom"]).then(function(){self.unsetWorkingClass(t);}); },

			/**************************************************/
			/** other Contextmenuentries **/
			/**************************************************/
			"autodiscover": function (t) { _Prtg.objectTools.discoverObjectNow.apply(t, [(t.attr('data-id')||t.attr('id'))]); },
			"autodiscovertemplate": function (t) { _Prtg.objectTools.discoverObjectTemplate.apply(t, [(t.attr('data-id')||t.attr('id'))]); },
			"prio1": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPriority.apply(t, [(t.attr('data-id')||t.attr('id')), "1"]); },
			"prio2": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPriority.apply(t, [(t.attr('data-id')||t.attr('id')), "2"]); },
			"prio3": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPriority.apply(t, [(t.attr('data-id')||t.attr('id')), "3"]); },
			"prio4": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPriority.apply(t, [(t.attr('data-id')||t.attr('id')), "4"]); },
			"prio5": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setObjectPriority.apply(t, [(t.attr('data-id')||t.attr('id')), "5"]); },
			"instantreport": function (t) { _Prtg.Hjax.loadLink("/addreport.htm?id=new&addid=" + (t.attr('data-id')||t.attr('id'))); },
			"addfavorite": function (t) { self.setWorkingClass(t); _Prtg.objectTools.faveObject.apply(t, [(t.attr('data-id')||t.attr('id')), "1"]); },
			"removefavorite": function (t) { self.setWorkingClass(t); _Prtg.objectTools.faveObject.apply(t, [(t.attr('data-id')||t.attr('id')), "0"]); },
			"check": function (t) { self.setWorkingClass(t); _Prtg.objectTools.checkObjectNow.apply(t, [(t.attr('data-id')||t.attr('id'))]).then(function(){self.unsetWorkingClass(t);}); },
			"pause": function (t) { self.setWorkingClass(t);  _Prtg.objectTools.pauseObject.apply(t, [(t.attr('data-id')||t.attr('id')), "toggle"]).fail(function(){self.unsetWorkingClass(t);}); },
			"pausenow": function (t) { self.setWorkingClass(t);  _Prtg.objectTools.pauseObject.apply(t, [(t.attr('data-id')||t.attr('id')), "0"]).fail(function(){self.unsetWorkingClass(t);}); },
			"pausenowcomment": function (t) { self.setWorkingClass(t); _Prtg.objectTools.pauseWithComment.apply(t, [(t.attr('data-id')||t.attr('id')), 0, this]).fail(function(){self.unsetWorkingClass(t);}); },
			"resumenow": function (t) { self.setWorkingClass(t);  _Prtg.objectTools.pauseObject.apply(t, [(t.attr('data-id')||t.attr('id')), "1", this]).fail(function(){self.unsetWorkingClass(t);}); },
			"pausefor5": function (t) { self.setWorkingClass(t); _Prtg.objectTools.pauseWithComment.apply(t, [(t.attr('data-id')||t.attr('id')), 5, this]).fail(function(){self.unsetWorkingClass(t);}); },
			"pausefor15": function (t) { self.setWorkingClass(t); _Prtg.objectTools.pauseWithComment.apply(t, [(t.attr('data-id')||t.attr('id')), 15, this]).fail(function(){self.unsetWorkingClass(t);}); },
			"pausefor60": function (t) { self.setWorkingClass(t); _Prtg.objectTools.pauseWithComment.apply(t, [(t.attr('data-id')||t.attr('id')),60, this]).fail(function(){self.unsetWorkingClass(t);}); },
			"pausefor180": function (t) { self.setWorkingClass(t); _Prtg.objectTools.pauseWithComment.apply(t, [(t.attr('data-id')||t.attr('id')),180, this]).fail(function(){self.unsetWorkingClass(t);}); },
			"pausefor1440": function (t) { self.setWorkingClass(t); _Prtg.objectTools.pauseWithComment.apply(t, [(t.attr('data-id')||t.attr('id')), 1440, this]).fail(function(){self.unsetWorkingClass(t);}); },
			"pauseuntil": function (t) { self.setWorkingClass(t); _Prtg.objectTools.pauseUntil.call(t, (t.attr('data-id')||t.attr('id'))).fail(function(){ self.unsetWorkingClass(t);}); },
      		"pauseanderror": function (t) { self.setWorkingClass(t); _Prtg.objectTools.simulateObject.apply(t, [(t.attr('data-id')||t.attr('id')), "1"]); },
      		"maintenance": function (t) { self.setWorkingClass(t); _Prtg.objectTools.setMaintenanceWindow.apply(t, [(t.attr('data-id')||t.attr('id')), "1"]).fail(function(){self.unsetWorkingClass(t);}); },
			"dodelete": function (t) { _Prtg.objectTools.deleteObject.apply(t,[(t.attr('data-id')||t.attr('id')),!!t.closest('[callerid]').andSelf().attr('callerid')]);},
			"editaccessrights": function (t) { _Prtg.objectTools.editSettingsDialog.call(t, "/editrights.htm", (t.attr('data-id')||t.attr('id')));},
      		"sortsub": function (t) { self.setWorkingClass(t); _Prtg.objectTools.sortSubObjects.call(t, (t.attr('data-id')||t.attr('id'))); },
      		"newticket": function(t){_Prtg.objectTools.ticketAdd.call(t, 'new', (t.attr('data-id')||t.attr('id')));},
			/**************************************************/
			/** Contextmenu for Others**/
			/**************************************************/
			"refresh": function (t) { _Prtg.Events.publish('refresh.events.prtg'); },
			"makehomepage": function (t) { self.makeThisMyHomepage(); },
			"logout": function (t) { document.location.href = '/index.htm?logout=1'; }
		},
		menuItems: [
		// SYSTEM MENU ------------------------------------------------------------------------------------------------------------------------------------------------
			{ cls:'system menuhead', id:'', caption:'<#langjs key="js.contextmenus.PRTGSystemMenu" default="PRTG System Menu">'},
			{ cls:'system', id:'refresh', ui:'glyph-spin3', caption:'<#langjs key="js.contextmenus.refresh" default="Refresh">'},
			{ cls:'system hideforreadonlyuser makemyhomelink', ui:'glyph-home', id:'makehomepage', caption:'<#langjs key="html.menu.Home.MakeThisMyHomepage" default="Make This My Home Page">'},
			{ cls:'system separator', id:'logout', ui:'glyph-power',caption:'<#langjs key="js.contextmenus.Logout" default="Log Out">'},
			{ cls:'system separator browsermenu', id:'' , caption:'<#langjs key="js.contextmenus.HoldCTRLforbrowsermenu" default="Hold CTRL or Shift for browser menu">'},
		// SENSOR MENU ------------------------------------------------------------------------------------------------------------------------------------------------
			{ cls:'sensor menuhead', id:'', caption:'<#langjs key="js.contextmenus.SensorMenu" default="Sensor Context Menu">'},
			{ cls:'sensor hideforreadonlyuser', id:'check', ui:'glyph-arrows-cw', caption:'<#langjs key="js.contextmenus.CheckNow" default="Scan Now">'},
			{ cls:'sensor', id:'sensordetail',  ui:'glyph-search2', caption:'<#langjs key="js.contextmenus.Details" default="Details">&hellip;'},
			{ cls:'sensor hideforreadonlyuser', id:'', ui:'glyph-edit', caption:'<#langjs key="js.contextmenus.Edit" default="Edit">'},
			[
				{ cls:'sensor', id:'sensoredit', ui:'glyph-wrench2', caption:'<#langjs key="js.contextmenus.Settings" default="Settings">&hellip;'},
				{ cls:'sensor', id:'sensornotifications', ui:'glyph-bell-alt', caption:'<#langjs key="js.contextmenus.Notifications" default="Notification Triggers">&hellip;'},
				{ cls: 'sensor', id: 'editaccessrights', ui: 'glyph-lock2', caption: '<#langjs key="js.contextmenus.access" default="Access Rights">&hellip;' },
				{ cls:'sensor', id:'sensorrename', ui:'glyph-doc', caption:'<#langjs key="js.contextmenus.Rename" default="Rename">&hellip;'}
			],
		// DEVICE MENU ------------------------------------------------------------------------------------------------------------------------------------------------
			{ cls:'device menuhead', id:'', caption:'<#langjs key="js.contextmenus.DeviceMenu" default="Device Context Menu">'},
			{ cls:'device hideforreadonlyuser disableifpaused disableifpausedbyparent', id:'check', ui:'glyph-arrows-cw', caption:'<#langjs key="js.contextmenus.CheckNow" default="Scan Now">'},
			{ cls:'device', id:'devicedetail', ui:'glyph-search2', caption:'<#langjs key="js.contextmenus.Details" default="Details">&hellip;'},
			{ cls:'device hideforreadonlyuser', id:'', ui:'glyph-edit', caption:'<#langjs key="js.contextmenus.Edit" default="Edit">'},
			[
				{ cls:'device', id:'deviceedit', ui:'glyph-wrench2', caption:'<#langjs key="js.contextmenus.Settings" default="Settings">&hellip;'},
				{ cls: 'device', id: 'devicenotifications', ui: 'glyph-bell-alt', caption: '<#langjs key="js.contextmenus.Notifications" default="Notification Triggers">&hellip;' },
				{ cls: 'device disableforreadonlygroup', id: 'editaccessrights', ui: 'glyph-lock2', caption: '<#langjs key="js.contextmenus.access" default="Access Rights">&hellip;' },
				{ cls:'device disableforreadonlygroup', id:'devicerename', ui:'glyph-doc', caption:'<#langjs key="js.contextmenus.Rename" default="Rename">&hellip;'}
			],
			{ cls:'device disableforreadonlygroup hideforreadonlyuser hideforclusterprobe separator', id:'deviceaddsensor', ui:'glyph-plus-circled',  caption:'<#langjs key="js.contextmenus.AddSensor" default="Add Sensor">&hellip;'},
			{ cls:'device disableforreadonlygroup hideforreadonlyuser autodiscoverable isnotautodiscoverable hideforclusterprobe hideforsmallprobe disableifpaused disableifpausedbyparent', ui:'glyph-spin6', id:'', caption:'<#langjs key="js.contextmenus.AutoDiscovery" default="Auto-Discovery">'},
			[
				{ cls:'device hideforreadonlyuser hideforclusterprobe isnotautodiscoverable hideforsmallprobe disableifpaused disableifpausedbyparent', ui:'glyph-spin6', id:'autodiscover', caption:'<#langjs key="js.contextmenus.RunAutoDiscovery" default="Run Auto-Discovery">'},
				{ cls:'device hideforreadonlyuser hideforclusterprobe isnotautodiscoverable hideforsmallprobe disableifpaused disableifpausedbyparent', ui:'glyph-spin6', id:'autodiscovertemplate', caption:'<#langjs key="js.contextmenus.RunAutoDiscoveryTemplate" default="Run Auto-Discovery with Template">'}
      		],
			{ cls:'device disableforreadonlygroup hideforreadonlyuser hideifisautonomous hideforclusterprobe hideforsmallprobe', id:'devicecreatetemplate', ui:'glyph-docs', caption:'<#langjs key="js.contextmenus.CreateDeviceTemplate" default="Create Device Template">&hellip;'},
			{ cls:'device disableforreadonlygroup hideforreadonlyuser hideifisautonomous hideforclusterprobe hideforsmallprobe hideforprobedevice hideonpodlocalprobe', id:'recommendnow', ui:'glyph-info-circled', caption:'<#langjs key="js.contextmenus.RecommendNow" default="Recommend Now">'},
      		{ cls:'device hideforreadonlyuser hideforclusterprobe', id:'sortsub', ui:'glyph-sort-name-up', caption:'<#langjs key="js.contextmenus.sortSubObjects" default="Sort Alphabetically">'},

		// LIBRARY MENU ------------------------------------------------------------------------------------------------------------------------------------------------
			{ cls:'library menuhead', id:'', caption:'<#langjs key="js.contextmenus.LibraryMenu" default="Library Context Menu">'},
			{ cls:'libraryobject menuhead', id:'', caption:'<#langjs key="js.contextmenus.LibraryObjectMenu" default="Library Node Menu">'},
			{ cls:'library hideinwingui', id:'libdetail',  ui:'glyph-search2', caption:'<#langjs key="js.contextmenus.Details" default="Details">&hellip;'},
			{ cls:'libraryobject', id:'libobjectdetail',  ui:'glyph-search2', caption:'<#langjs key="js.contextmenus.Details" default="Details">&hellip;'},
			{ cls: 'library libraryroot libraryobject hideforreadonlyuser', id: '', ui: 'glyph-edit', caption: '<#langjs key="js.contextmenus.Edit" default="Edit">' },
			[
				{ cls: 'library disablefornonrootlibrary', id: 'libedit', ui: 'glyph-wrench2', caption: '<#langjs key="js.contextmenus.Settings" default="Settings">&hellip;' },
				{ cls:'libraryobject', id:'libobjectedit', ui:'glyph-wrench2', caption:'<#langjs key="js.contextmenus.Settings" default="Settings">&hellip;'},
				{ cls: 'library disablefornonrootlibrary', id: 'libmanage', ui: 'glyph-cog2', caption: '<#langjs key="js.contextmenus.manage" default="Management">&hellip;' },
				{ cls:'library libraryobject', id:'librename', ui:'glyph-doc', caption:'<#langjs key="js.contextmenus.Rename" default="Rename">&hellip;'}
			],
			{ cls: 'hideforreadonlyuser library library-node separator', ui: 'glyph-trash-empty', id: 'libdodelete', caption: '<#langjs key="js.contextmenus.DeleteLibraty" default="Delete">&hellip;' },
			{ cls: 'library hideforreadonlyuser separator', id: 'libaddnode', ui: 'glyph-plus-circled', caption: '<#langjs key="html.global.addlibraynode" default="Add Library Node">&hellip;' },
			{ cls: 'library hideforreadonlyuser', id: 'libaddlib', ui: 'glyph-plus-circled', caption: '<#langjs key="html.global.addgroup" default="Add Group">&hellip;' },
		// GROUP MENU ------------------------------------------------------------------------------------------------------------------------------------------------
			{ cls:'group menuhead', id:'', caption:'<#langjs key="js.contextmenus.GroupMenu" default="Group Context Menu">'},
			{ cls:'group hideforreadonlyuser disableifpaused disableifpausedbyparent', id:'check', ui:'glyph-arrows-cw', caption:'<#langjs key="js.contextmenus.CheckNow" default="Scan Now">'},
			{ cls:'group', id:'groupdetail',  ui:'glyph-search2', caption:'<#langjs key="js.contextmenus.Details" default="Details">&hellip;'},
			{ cls:'group hideforreadonlyuser', id:'', ui:'glyph-edit', caption:'<#langjs key="js.contextmenus.Edit" default="Edit">'},
			[
				{ cls:'group', id: 'groupedit', ui:'glyph-wrench2', caption:'<#langjs key="js.contextmenus.Settings" default="Settings">&hellip;'},
				{ cls:'group', id: 'groupnotifications', ui: 'glyph-bell-alt', caption: '<#langjs key="js.contextmenus.Notifications" default="Notification Triggers">&hellip;' },
				{ cls:'group disableforreadonlygroup', id: 'editaccessrights', ui: 'glyph-lock2', caption: '<#langjs key="js.contextmenus.access" default="Access Rights">&hellip;' },
				{ cls:'group disableforreadonlygroup', id: 'grouprename', ui:'glyph-doc', caption:'<#langjs key="js.contextmenus.Rename" default="Rename">&hellip;'},
				{ cls: 'group hideforreadonlyuser separator disableforlibrary', id: 'groupmanage', ui: 'glyph-cog2', caption: '<#langjs key="js.contextmenus.manage" default="Management">...' }
			],
			{ cls:'group disableforreadonlygroup hideforreadonlyuser separator', id:'groupaddgroup', ui:'glyph-plus-circled', caption:'<#langjs key="js.contextmenus.AddGroup" default="Add Group">&hellip;'},
			{ cls:'group disableforreadonlygroup hideforreadonlyuser hideforsmallprobe hideonpodlocalprobe', id:'groupaddautogroup', ui:'glyph-plus-circled', caption:'<#langjs key="js.contextmenus.AddAutoDiscoveryGroup" default="Add Auto-Discovery Group">&hellip;'},
			{ cls:'group disableforreadonlygroup hideforreadonlyuser', id:'groupadddevice', ui:'glyph-plus-circled', caption:'<#langjs key="js.contextmenus.AddDevice" default="Add Device">&hellip;'},
			{ cls:'group disableforreadonlygroup autodiscoverable hideforreadonlyuser hideforsmallprobe disableifpaused disableifpausedbyparent hideonpodlocalprobe', id:'', ui:'glyph-binoculars2', caption:'<#langjs key="js.contextmenus.AutoDiscovery" default="Auto-Discovery">'},
      		[
					{ cls:'group hideforreadonlyuser hideforsmallprobe disableifpaused disableifpausedbyparent', ui:'glyph-spin6', id:'autodiscover', caption:'<#langjs key="js.contextmenus.RunAutoDiscovery" default="Run Auto-Discovery">'},
					{ cls:'group hideforreadonlyuser hideforsmallprobe disableifpaused disableifpausedbyparent', ui:'glyph-spin6', id:'autodiscovertemplate', caption:'<#langjs key="js.contextmenus.RunAutoDiscoveryTemplate" default="Run Auto-Discovery with Template">'}
      		],
      		{ cls:'group hideforreadonlyuser', id:'sortsub', ui:'glyph-sort-name-up', caption:'<#langjs key="js.contextmenus.sortSubObjects" default="Sort Alphabetically">'},

		// ROOTGROUP MENU ------------------------------------------------------------------------------------------------------------------------------------------------
			{ cls:'rootgroup menuhead', id:'', caption:'<#langjs key="js.contextmenus.GroupMenu" default="Group Context Menu">'},
			{ cls:'rootgroup hideforreadonlyuser disbleifpaused disableifpausedbyparent', id:'check', ui:'glyph-arrows-cw', caption:'<#langjs key="js.contextmenus.CheckNow" default="Scan Now">'},
			{ cls:'rootgroup', id:'rootgroupdetail',  ui:'glyph-search2', caption:'<#langjs key="js.contextmenus.Details" default="Details">&hellip;'},
			{ cls:'rootgroup hideforreadonlyuser', id:'', ui:'glyph-edit', caption:'<#langjs key="js.contextmenus.Edit" default="Edit">'},
			[
				{ cls:'rootgroup', id:'rootgroupedit', ui:'glyph-wrench2', caption:'<#langjs key="js.contextmenus.Settings" default="Settings">&hellip;'},
				{ cls:'rootgroup', id:'rootgroupnotifications', ui:'glyph-bell-alt', caption:'<#langjs key="js.contextmenus.Notifications" default="Notification Triggers">&hellip;'},
				{ cls:'rootgroup disableforreadonlygroup', id: 'editaccessrights', ui: 'glyph-lock2', caption: '<#langjs key="js.contextmenus.access" default="Access Rights">&hellip;' },
				{ cls:'rootgroup disableforreadonlygroup', id:'rootgrouprename', ui:'glyph-doc', caption:'<#langjs key="js.contextmenus.Rename" default="Rename">&hellip;'},
				{ cls:'rootgroup separator', id:'rootgroupmanage', ui:'glyph-cog2', caption:'<#langjs key="js.contextmenus.manage" default="Management">&hellip;'}
			],
		// PROBE MENU ------------------------------------------------------------------------------------------------------------------------------------------------
			{ cls:'probe menuhead', id:'', caption:'<#langjs key="js.contextmenus.ProbeMenu" default="Probe Context Menu">'},
			{ cls:'probe hideforreadonlyuser disableifpausedbyparent', id:'check', ui:'glyph-arrows-cw', caption:'<#langjs key="js.contextmenus.CheckNow" default="Scan Now">'},
			{ cls:'probe', id:'probedetail',  ui:'glyph-search2', caption:'<#langjs key="js.contextmenus.Details" default="Details">&hellip;'},
			{ cls:'probe hideforreadonlyuser', id:'', ui:'glyph-edit', caption:'<#langjs key="js.contextmenus.Edit" default="Edit">'},
			[
				{ cls:'probe', id:'probeedit', ui:'glyph-wrench2', caption:'<#langjs key="js.contextmenus.Settings" default="Settings">&hellip;'},
				{ cls:'group', id:'probemanage', ui:'glyph-wrench2', caption:'<#langjs key="js.contextmenus.manage" default="Management">&hellip;'},
				{ cls:'probe', id: 'probenotifications', ui: 'glyph-bell-alt', caption: '<#langjs key="js.contextmenus.Notifications" default="Notification Triggers">&hellip;' },
				{ cls:'probe disableforreadonlygroup', id: 'editaccessrights', ui: 'glyph-lock2', caption: '<#langjs key="js.contextmenus.access" default="Access Rights">&hellip;' },
				{ cls:'probe disableforreadonlygroup', id:'proberename', ui:'glyph-doc', caption:'<#langjs key="js.contextmenus.Rename" default="Rename">&hellip;'},
				{ cls:'probe hideforreadonlyuser separator disableforlibrary', id: 'probemanage', ui: 'glyph-cog2', caption: '<#langjs key="js.contextmenus.manage" default="Management">...' }
			],
			{ cls:'probe disableforreadonlygroup hideforreadonlyuser separator', id:'probeaddgroup', ui:'glyph-plus-circled', caption:'<#langjs key="js.contextmenus.AddGroup" default="Add Group">&hellip;'},
			{ cls:'probe disableforreadonlygroup hideforreadonlyuser hideforsmallprobe hideonpodlocalprobe', id:'probeaddautogroup', ui:'glyph-plus-circled', caption:'<#langjs key="js.contextmenus.AddAutoDiscoveryGroup" default="Add Auto-Discovery Group">&hellip;'},
			{ cls:'probe disableforreadonlygroup hideforreadonlyuser', id:'probeadddevice', ui:'glyph-plus-circled', caption:'<#langjs key="js.contextmenus.AddDevice" default="Add Device">&hellip;'},
      		{ cls:'probe hideforreadonlyuser', id:'sortsub', ui:'glyph-sort-name-up', caption:'<#langjs key="js.contextmenus.sortSubObjects" default="Sort Alphabetically">'},
			{ cls:'disableforreadonlygroup hideforreadonlyuser allowackuser sensor sensorred hideforclusterprobe', id:'sensoracknowledge', ui:'glyph-ok', caption:'<#langjs key="js.contextmenus.AcknowledgeAlarm" default="Acknowledge Alarm...">'},
			[
			
				{ cls: 'sensor rootgroup hideforreadonlyuser allowackuser device group probe separator', id: 'sensoracknowledgefor5', ui:'glyph-clock', caption: '<#langjs key="js.contextmenus.Pause.For5Minutes" default="For 5 Minutes">&hellip;' },
				{ cls: 'sensor rootgroup hideforreadonlyuser allowackuser device group probe', id: 'sensoracknowledgefor15', ui:'glyph-clock', caption: '<#langjs key="js.contextmenus.Pause.For15Minutes" default="For 15 Minutes">&hellip;' },
				{ cls: 'sensor rootgroup hideforreadonlyuser allowackuser device group probe', id: 'sensoracknowledgefor60', ui:'glyph-clock', caption: '<#langjs key="js.contextmenus.Pause.For1Hour" default="For 1 Hour">&hellip;' },
				{ cls: 'sensor rootgroup hideforreadonlyuser allowackuser device group probe', id: 'sensoracknowledgefor180', ui:'glyph-clock', caption: '<#langjs key="js.contextmenus.Pause.For3Hours" default="For 3 Hours">&hellip;' },
				{ cls: 'sensor rootgroup hideforreadonlyuser allowackuser device group probe', id: 'sensoracknowledgefor1440', ui:'glyph-clock', caption: '<#langjs key="js.contextmenus.Pause.For1Day" default="For 1 Day">&hellip;' },

			],
			{ cls:'probe hideiffixed disableforreadonlygroup hideforreadonlyuser group device sensor separator disableforlibrary', ui: 'glyph-trash-empty', id: 'dodelete', caption: '<#langjs key="js.contextmenus.Delete" default="Delete">&hellip;' },
			{ cls:'hideforreadonlyuser libraryobject separator', ui: 'glyph-trash-empty', id: 'libdodelete', caption: '<#langjs key="js.contextmenus.DeleteFrom" default="Delete from Library">&hellip;' },
			{ cls:'device hideifisautonomous hideforreadonlyuser', id:'deviceclone', ui:'glyph-docs', caption:'<#langjs key="js.contextmenus.Clone" default="Clone">&hellip;'},
			{ cls:'group hideforreadonlyuser', id:'groupclone', ui:'glyph-docs', caption:'<#langjs key="js.contextmenus.Clone" default="Clone">&hellip;'},
			{ cls:'sensor hideiffixed hideforreadonlyuser', id:'sensorclone', ui:'glyph-docs', caption:'<#langjs key="js.contextmenus.Clone" default="Clone">&hellip;'},
			{ cls:'sensor disableforreadonlygroup hideforreadonlyuser device group probe libraryobject disableforlibrary hideifisautonomous', id: '', ui: 'glyph-shuffle2', caption: '<#langjs key="js.contextmenus.Move" default="Move">' },
			[
				{ cls: 'sensor hideforreadonlyuser device group probe libraryobject disableforlibrary', id: 'movetop', ui: 'glyph-move-up', caption: '<#langjs key="js.contextmenus.Move.Top" default="Top" comment="Top is part of a context menu that describes the direction of movement. The user clicks Move | (To) Top.">' },
				{ cls: 'sensor hideforreadonlyuser device group probe libraryobject disableforlibrary', id: 'moveup', ui: 'glyph-level-up', caption: '<#langjs key="js.contextmenus.Move.Up" default="Up" comment="Up is part of a context menu that describes the direction of movement. The user clicks Move | Up.">' },
				{ cls: 'sensor hideforreadonlyuser device group probe libraryobject disableforlibrary', id: 'movedown', ui: 'glyph-level-down', caption: '<#langjs key="js.contextmenus.Move.Down" default="Down" comment="Down is part of a context menu that describes the direction of movement. The user clicks Move | Down.">' },
				{ cls: 'sensor hideforreadonlyuser device group probe libraryobject disableforlibrary', id: 'movebottom', ui: 'glyph-move-down', caption: '<#langjs key="js.contextmenus.Move.Bottom" default="Bottom" comment="Bottom is part of a context menu that describes the direction of movement. The user clicks Move | (To) Bottom.">' },
				{ cls: 'group hideforreadonlyuser separator disableforlibrary', id: 'groupmove', caption: '<#langjs key="js.contextmenus.Move.ToOtherGroup" default="To Other Group" comment="To Other Group is part of a context menu that describes the direction of movement. The user clicks Move | To Other Group.">&hellip;' },
				{ cls: 'device hideforreadonlyuser separator disableforlibrary', id: 'devicemove', caption: '<#langjs key="js.contextmenus.Move.ToOtherGroup" default="To Other Group" comment="To Other Group is part of a context menu that describes the direction of movement. The user clicks Move | To Other Group.">&hellip;' },
				{ cls: 'group hideforreadonlyuser separator disableforlibrary', id: 'groupmanage', ui: 'glyph-cog2', caption: '<#langjs key="js.contextmenus.manage" default="Management">...' },
				{ cls: 'probe hideforreadonlyuser separator disableforlibrary', id: 'probemanage', ui: 'glyph-cog2', caption: '<#langjs key="js.contextmenus.manage" default="Management">...' }
			],
			
			[
				{ cls:'sensor rootgroup device group probe hideforreadonlyuser', data:{duration:null}, id:'pausenowcomment', ui:'glyph-pause3', caption:'<#langjs key="js.contextmenus.Pause.PauseIndefinitely" default="Pause Indefinitely">&hellip;'},
				{ cls:'sensor rootgroup hideforreadonlyuser device group probe separator', data:{duration:5}, id:'pausefor5', ui:'glyph-stopwatch', caption:'<#langjs key="js.contextmenus.Pause.For5Minutes" default="For 5 Minutes">&hellip;'},
				{ cls:'sensor rootgroup hideforreadonlyuser device group probe', data:{duration:15}, id:'pausefor15', ui:'glyph-stopwatch', caption:'<#langjs key="js.contextmenus.Pause.For15Minutes" default="For 15 Minutes">&hellip;'},
				{ cls:'sensor rootgroup hideforreadonlyuser device group probe', data:{duration:60}, id:'pausefor60', ui:'glyph-stopwatch', caption:'<#langjs key="js.contextmenus.Pause.For1Hour" default="For 1 Hour">&hellip;'},
				{ cls:'sensor rootgroup hideforreadonlyuser device group probe', data:{duration:180}, id:'pausefor180', ui:'glyph-stopwatch', caption:'<#langjs key="js.contextmenus.Pause.For3Hours" default="For 3 Hours">&hellip;'},
				{ cls:'sensor rootgroup hideforreadonlyuser device group probe', data:{duration:1440}, id:'pausefor1440', ui:'glyph-stopwatch', caption:'<#langjs key="js.contextmenus.Pause.For1Day" default="For 1 Day">&hellip;'},
				{ cls:'sensor rootgroup hideforreadonlyuser device group probe', data:{duration:"?"}, id:'pauseuntil', ui:'glyph-clock', caption:'<#langjs key="js.contextmenus.Pause.until" default="Until">&hellip;'},
        		{ cls:'sensor rootgroup hideforreadonlyuser device group probe separator', id:'maintenance', ui: 'glyph-history', caption:'<#langjs key="js.contextmenus.maintenance" default="One-time Maintenance Window">&hellip;'}
			],
			
			{ cls:'sensor rootgroup hideforreadonlyuser hideifnotpaused hideifpausedbyparent device group probe separator', id:'resumenow', ui:'glyph-play-1', caption:'<#langjs key="js.contextmenus.Resume" default="Resume">'},
			{ cls: 'sensor device group probe hideforreadonlyuser hideifnotpaused hideifpaused separator disabled', id: '', ui: 'glyph-play-1', title: '<#langjs key="js.contextmenus.resumeaparent" default="Resume a parent to resume this object!">', caption: '<#langjs key="js.contextmenus.ispausedbyparent" default="(Paused by parent)">' },
			{ cls:'device disableforreadonlygroup hideforreadonlyuser sensor separator', id:'', ui:'glyph-star-half-alt', caption:'<#langjs key="js.contextmenus.PriorityFavorite" default="Priority/Favorite">'},
			[
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-5', id:'prio5', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-4', id:'prio4', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-3', id:'prio3', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-2', id:'prio2', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-1', id:'prio1', caption:''},
				{ cls:'device hideiffavorite hideforreadonlyuser sensor separator', id:'addfavorite', ui:'glyph-flag2', caption:'<#langjs key="js.contextmenus.AddFavorite" default="Add to Favorites">'},
				{ cls:'device hideifnotfavorite hideforreadonlyuser sensor separator', id:'removefavorite', ui:'glyph-flag-empty', caption:'<#langjs key="js.contextmenus.RemoveFavorite" default="Remove from Favorites">'}
			],
			{ cls:'disableforreadonlygroup hideforreadonlyuser group probe separator', id:'', ui:'glyph-star-half-alt', caption:'<#langjs key="js.contextmenus.Priority" default="Priority">'},
			[
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-5', id:'prio5', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-4', id:'prio4', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-3', id:'prio3', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-2', id:'prio2', caption:''},
				{ cls:'device hideforreadonlyuser group sensor probe icon-priority-1', id:'prio1', caption:''},
			],
			{ cls:'group rootgroup probe device sensor', id:'', ui:'glyph-database', caption:'<#langjs key="js.contextmenus.HistoricData3" default="Historic Data">'},
			[
				{ cls:'group', id:'groupgraph1', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="2period">&hellip;'},
				{ cls:'group', id:'groupgraph2', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="3period">&hellip;'},
				{ cls:'group', id:'groupgraph3', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="4period">&hellip;'},
				{ cls:'rootgroup', id:'rootgroupgraph1', ui:'glyph-history', caption:'<#system type="2period">&hellip;'},
				{ cls:'rootgroup', id:'rootgroupgraph2', ui:'glyph-history', caption:'<#system type="3period">&hellip;'},
				{ cls:'rootgroup', id:'rootgroupgraph3', ui:'glyph-history', caption:'<#system type="4period">&hellip;'},
				{ cls:'probe', id:'probegraph1', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="2period">&hellip;'},
				{ cls:'probe', id:'probegraph2', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="3period">&hellip;'},
				{ cls:'probe', id:'probegraph3', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="4period">&hellip;'},
				{ cls:'device', id:'devicegraph1', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="2period">&hellip;'},
				{ cls:'device', id:'devicegraph2', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="3period">&hellip;'},
				{ cls:'device', id:'devicegraph3', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="4period">&hellip;'},
				{ cls:'sensor', id:'sensorgraph0', ui:'glyph-chart-area', caption:'<#langjs key="js.contextmenus.HistoricData.Live Data" default="Live Data">&hellip;'},
				{ cls:'sensor', id:'sensorgraph1', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="2period">&hellip;'},
				{ cls:'sensor', id:'sensorgraph2', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="3period">&hellip;'},
				{ cls:'sensor', id:'sensorgraph3', ui:'glyph-history', caption:'<#langjs key="js.contextmenus.HistoricData.Last" default="Last"> <#system type="4period">&hellip;'},
                { cls:'sensor separator', id:'sensorcompare', ui:'glyph-exchange', caption:'<#langjs key="js.contextmenus.HistoricData.Compare" default="Compare">&hellip;'},
                { cls:'sensor separator', id:'sensorhistoric', ui:'glyph-database', caption:'<#langjs key="js.contextmenus.HistoricData.ViewData" default="View Historic Data">&hellip;'},
				{ cls:'sensor device hideforreadonlyuser rootgroup group probe', id:'instantreport', ui:'glyph-doc', caption:'<#langjs key="js.contextmenus.Fold.createreport2" default="Create Report">&hellip;'}
			],
			{ cls:'device disableforreadonlygroup hideforreadonlyuser hideonpodprobedevice', id:'', ui:'glyph-briefcase2', caption:'<#langjs key="js.contextmenus.Tools2" default="Device Tools">'},
			[
				{ cls:'device hideforreadonlyuser', id:'serviceurl', ui:'glyph-link2', caption:'<#langjs key="js.contextmenus.Tools.ServiceURL" default="Go to Service URL">&hellip;'},
				{ cls:'device hideforreadonlyuser separator', id:'openhttp', ui:'glyph-link-ext', caption:'<#langjs key="js.contextmenus.Tools.OpenHTTP" default="New Window with HTTP">&hellip;'},
				{ cls:'device hideforreadonlyuser', id:'openhttps', ui:'glyph-link-ext', caption:'<#langjs key="js.contextmenus.Tools.OpenHTTPS" default="New Window with HTTPS">&hellip;'},
				{ cls:'device hideforreadonlyuser', id:'openftp', ui:'glyph-link-ext', caption:'<#langjs key="js.contextmenus.Tools.OpenFTP" default="New Window with FTP">&hellip;'},
				{ cls:'device hideforreadonlyuser separator', id:'devicerdp', ui:'glyph-terminal2', caption:'<#langjs key="js.contextmenus.Tools.RemoteDesktop" default="Remote Desktop">&hellip;'},
				{ cls:'device hideforreadonlyuser', id:'devicetracert', caption:'<#langjs key="js.contextmenus.Tools.Traceroute" default="Traceroute">&hellip;'},
        		{ cls:'device hidefornoneadmins hideforsmallprobe hideforremoteprobes', id:'deviceinstallprobe', caption:'<#langjs key="js.contextmenus.Tools.InstallProbe" default="Install Remote Probe">&hellip;'}
			],
      		{ cls:'device hideforreadonlyuser', id:'devicefindduplicates', ui:'glyph-search2 glyph-copy', caption:'<#langjs key="js.contextmenus.findduplicates" default="Find Duplicates">&hellip;'},
			{ cls:'sensor', id:'sensorsendlinkpermail', ui:'glyph-mail5', caption:'<#langjs key="js.contextmenus.sendpermail.sensor" default="Send Link by Email">'},
			{ cls:'device', id:'devicesendlinkpermail', ui:'glyph-mail5', caption:'<#langjs key="js.contextmenus.sendpermail.device" default="Send Link by Email">'},
			{ cls:'group', id:'groupsendlinkpermail', ui:'glyph-mail5', caption:'<#langjs key="js.contextmenus.sendpermail.group" default="Send Link by Email">'},
			{ cls:'probe', id:'probesendlinkpermail', ui:'glyph-mail5', caption:'<#langjs key="js.contextmenus.sendpermail.probe" default="Send Link by Email">'},
			{ cls:'rootgroup', id:'rootsendlinkpermail', ui:'glyph-mail5', caption:'<#langjs key="js.contextmenus.sendpermail.root" default="Send Link by Email">'},
			{ cls:'libraryobject library', id:'libsendlinkpermail', ui:'glyph-mail5', caption:'<#langjs key="js.contextmenus.sendpermail.lib" default="Send Link by Email">'},
			{ cls:'rootgroup probe group device sensor hideforreadonlyuser hidefornotticketsystem', id:'newticket', ui:'glyph-ticket2', caption:'<#langjs key="html.global.addticket" default="Add Ticket">'}
		],
		buildMailtoLink: function buildMailtoLink(t, type) {

			return "mailto:?subject=["
				+ '<#system type="sitename">'
				+ "] "
				+ '<#langjs key="html.global.linkto" default="Link to"> <#system type="serverhttpurl">'
				+ "/"+type+".htm?id=" + (t.attr('data-id')||t.attr('id')) + ' ' + (t.text()||'')
				+ "&body="
				+ '<#langjs key="html.global.pleaselookaturl" default="Please look at this URL">'
				+ ": "
				+ '<#system type="serverhttpurl">'
				+ "/"+type+".htm?id=" + (t.attr('data-id')||t.attr('id'));
		},
		setWorkingClass: function setWorkingClass(elm) {
			var target = $(elm.attr('target') || elm[0]);
			target.addClass("working");
		},
		unsetWorkingClass: function unsetWorkingClass(elm) {
			var target = $(elm.attr('target') || elm[0]);
			target.removeClass("working");
		},
		makeThisMyHomepage: function makeThisMyHomepage() {
      $.post('/makehome?hash='+escape(window.location.hash.substr(1,100))+'&url='+escape(window.location.pathname+''+window.location.search),
       function(){
        _Prtg.Dialogs.alert(
          $('<div>'+ _Prtg.Lang.Dialogs.strings.homepageMessage+'</div>'),
          _Prtg.Lang.Dialogs.strings.homepageTitle,
          {}
        );
       });
		},
		menuCommands: {}
	};
	function installContextMenu() {
		var settings = {
			contextMenus: $(createSubMenu(self.menuItems)),
			menuStyle: {
				bindToEvent: "contextmenu"
			},
			bindings: self.bindings,
			onContextMenu: function(e) {
				if($("#ptip").is(":visible") || $('body').is('.mapshow')){
					return false;
				} else {
					_Prtg.Tip.kill();
				}
				var myresult = false;
				myobject = $(e.target);
				if (!myobject.is('[id],[data-id]')) {
					myobject = myobject.find('[id]').eq(0);
					if(myobject.length === 0 && $(e.target).closest('[contextmenu]').length > 0){
						myobject = $(e.target).closest('[contextmenu]').eq(0);
					}
				}
        		var c = myobject.attr("class");
				   myresult = /mapmarker/.test(c)===false && /(probe|probenode|group|device|sensor|library|system|rootgroup|libraryobject)menu|sensr|sensq|tabs-container/.test(c)===true;
				//special case for library menu in table
				if(myresult 
				&& myobject.is('.librarymenu')
				&& myobject.closest('#form_libtable').length > 0)
					myresult = false;
				if(!myresult) { //if no other menu should be shown, let's show the system menu, but only for specific DOM object types
					myresult = (myobject.length === 0); //user clicked into an "undefined" area
					if(!myresult) {
						myresult = myobject.is("div,td,p,h1,h2,h3,body");
					}
				}
				if($(myobject).parents("#form_devicesort").length > 0) { //no contextmenu on device/group sort page
					myresult = false;
				}
				e.target = myobject[0];
				return myresult;
			},
			onShowMenu: function(e, menu) {
				var c = null
					, cc = null;
				$('li', menu).hide();
				cc = myobject.attr("class");
				if(cc) {
					var m = /([a-z]+)menu/i;
					c = cc.replace(/systemmenu/gi, "");
					if(m.test(c)) {
						c = RegExp.lastMatch.replace(/nodemenu/, "").replace(/menu/i, "");
						if(c.length === 0 && !window.winGUI) {
							c = "system";
						}
						c.length && $("li." + c, menu).show();
						if(myobject.is(".sensormenu")) {
							if(!(myobject.hasClasses(['sensorred', 'sensr', 'sr', 'senso', 'so' ,'status5','status14'])) & !($('.sensorid' + myobject.attr("id")).hasClasses(['sensorred', 'sensr', 'sr', 'senso', 'so']))) {
								$('li.sensorred', menu).hide();
							}
						}
					} else {
						!window.winGUI && $('li.system', menu).show();
					}
				} else {
					!window.winGUI && $('li.system', menu).show();
				}

				if(!_Prtg.Options.recommender)
					$('li#recommendnow', menu).hide();
				if(_Prtg.Options.userIsReadOnly) {
					if(_Prtg.Options.allowAcknowledge) {
						$('li.hideforreadonlyuser', menu).each(function(index, element) {
							if(!$(this).hasClass('allowackuser')) {
								$(this).hide();
							}
						});
					} else {
						$('li.hideforreadonlyuser', menu).hide();
					}
				}
				if(myobject.is('.readonlycontextmenu') ) {
					$('li.disableforreadonlygroup', menu).each(function(index, element) {
						$(this).addClass("disabled");
					});
				}
				if(!_Prtg.Options.userTicketSystem)
					$('li.hidefornotticketsystem').hide();
				if(myobject.is('.fixed')
				|| (myobject.is('.devicemenu')
				&& (myobject.attr('data-id')||myobject.attr('id'))==='40')){
					$('li.hideiffixed', menu).addClass("disabled");
				}
				if(myobject.is(".ispaused")) {
					$('li.disableifpaused', menu).addClass("disabled");
					$('li.hideifpaused', menu).hide();
				}
				if(myobject.is(".isnotpaused")) {
					$('li.hideifnotpaused', menu).hide();
				}
				if(myobject.is(".menulink")) {
					$('li.hideformenulink', menu).hide();
				}
				if(myobject.is(".ispausedbyparent")) {
					$('li.disableifpausedbyparent', menu).addClass("disabled");
					$('li.hideifpausedbyparent', menu).hide();
				}
				if(myobject.is(".isfavorite")) {
					$('li.hideiffavorite', menu).hide();
				}
				if(myobject.is(".isnotfavorite")) {
					$('li.hideifnotfavorite', menu).hide();
				}
				if(myobject.is(".clusterprobedevice")) {
					$('li.hideforclusterprobe', menu).hide();
				}
				if(myobject.is(".smallprobe")) {
					$('li.hideforsmallprobe', menu).hide();
					$('li.disableforsmallprobe', menu).addClass("disabled");
        		}
				if(myobject.is(".device.fixed")) {
					$('li.hideforprobedevice', menu).hide();
					$('li.disabledforprobedevice', menu).addClass("disabled");
    		    }
				if(myobject.is(".librarymenu")) {
					$('li.disableforlibrary', menu).addClass("disabled");
				} else {
					$('li.disablefornonrootlibrary', menu).addClass("disabled");
				}
				if(myobject.is(".isnotautodiscoverable")){
					$('li.autodiscoverable').addClass("disabled");
				}
				if(myobject.is(".device.fixed")) {
					$('li.hideforprobedevice', menu).hide();
					$('li.disabledforprobedevice', menu).addClass("disabled");
				}
				if(myobject.is(".device.localprobe.pod,.devicemenu.localprobe.pod")) {
					$('li.hideonpodprobedevice', menu).hide();
				}
				if(myobject.is(".localprobe.pod")) {
					$('li.hideonpodlocalprobe', menu).hide();
				}
				if(myobject.is(".device.remoteprobe,.devicemenu.remoteprobe")) {
					$('li.hideforremoteprobes', menu).hide();
				}
				if(myobject.is(".isautonomous")){
					$('li.hideifisautonomous', menu).addClass("disabled");
				}
				return menu;
			}
		};
		_Prtg.Contextmenu.menu = $(document).contextMenu("PRTGContextMenu", settings);
		$('body').on('click', '.menuleft', function(e){
			var ee = jQuery.Event("contextmenu");
			ee.target = this;
			ee = $.extend(true,e,ee);
			_Prtg.Contextmenu.menu.trigger(ee);
		});

		function createSubMenu( items ) {
			var ul = []
				, itm
				, nxt;
			for (var i = 0, itemlen = items.length; i < itemlen; i++) {
				itm = items[i];
				nxt = items[i+1];
				if(itm.id !== 'sensorcompare'){ //filtering compare option since removing it breaks the text in EC
					if ( !(itm instanceof Array) ) {
						if ( itm.id ) self.menuCommands[itm.id] = itm;
						if ( itm.txt === undefined )
							itm.txt = "";
						else
							itm.ui = "txt";
						if( itm.data === undefined)
							itm.data = "";
						else
							itm.data = " data-params='" + JSON.stringify(itm.data) +"' ";
						if(itm.ui !== undefined && itm.ui !== "")
							itm.icon = itm.ui;
						else
							itm.icon = '';

						if ( nxt instanceof Array ) {
							itm['nxt'] = "<i class='icon-dark icon-carat-1-e'></i>";
						} else {
							itm['nxt'] = "</li>";
						}
							ul.push("\n<li id='{id}' class='{cls}'{data}><i class='{icon}'>{txt}</i>{caption}{nxt}".printf(itm));
					} else {
						ul.push(createSubMenu(itm) +"</li>");
					}
            	}
			}
			return "<ul>"+ ul.join("\n") + "</ul>";
		}
	}

	_Prtg.Contextmenu = self;
	installContextMenu();
	$.fn.extend({
		hasClasses: function (selectors) {
			var self = this;
			for (var i in selectors) {
				if ($(self).hasClass(selectors[i]))
					return true;
				}
				return false;
			}
	});
})(true);
