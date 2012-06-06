//     Create.js 1.0.0alpha1 - On-site web editing interface
//     (c) 2011-2012 Henri Bergius, IKS Consortium
//     Create may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://createjs.org/
(function(a,b){a.widget("Midgard.midgardCreate",{options:{toolbar:"full",saveButton:null,state:"browse",highlight:!0,highlightColor:"#67cc08",editorWidgets:{Text:"halloWidget","default":"halloWidget"},editorOptions:{},enableEditor:null,disableEditor:null,url:function(){},storagePrefix:"node",workflows:{url:null},notifications:{},vie:null,stanbolUrl:null},_create:function(){this.options.vie?this.vie=this.options.vie:(this.vie=new VIE,this.vie.use(new this.vie.RdfaService),this.options.stanbolUrl&&this.vie.use(new this.vie.StanbolService({proxyDisabled:!0,url:this.options.stanbolUrl}))),this._checkSession(),this._enableToolbar(),this._saveButton(),this._editButton(),this.element.midgardStorage({vie:this.vie,url:this.options.url}),this.element.midgardWorkflows&&this.element.midgardWorkflows(this.options.workflows),this.element.midgardNotifications&&this.element.midgardNotifications(this.options.notifications)},_init:function(){this.options.state==="edit"?this._enableEdit():this._disableEdit()},showNotification:function(b){this.element.midgardNotifications&&a(this.element).data("midgardNotifications").create(b)},_checkSession:function(){if(!Modernizr.sessionstorage)return;var a=this.options.storagePrefix+"Midgard.create.toolbar";sessionStorage.getItem(a)&&this._setOption("toolbar",sessionStorage.getItem(a));var b=this.options.storagePrefix+"Midgard.create.state";sessionStorage.getItem(b)&&this._setOption("state",sessionStorage.getItem(b)),this.element.bind("midgardcreatestatechange",function(a,c){sessionStorage.setItem(b,c.state)})},_saveButton:function(){return this.options.saveButton?this.options.saveButton:(a(".create-ui-toolbar-statustoolarea .create-ui-statustools",this.element).append(a('<li id="midgardcreate-save"><a class="create-ui-btn">Save <i class="icon-ok"></i></a></li>')),this.options.saveButton=a("#midgardcreate-save",this.element),this.options.saveButton.hide(),this.options.saveButton)},_editButton:function(){var b=this,c={edit:'<a class="create-ui-btn">Cancel <i class="icon-remove"></i></a>',browse:'<a class="create-ui-btn">Edit <i class="icon-edit"></i></a>'};a(".create-ui-toolbar-statustoolarea .create-ui-statustools",this.element).append(a('<li id="midgardcreate-edit">'+c[b.options.state]+"</li>"));var d=a("#midgardcreate-edit",this.element);this.options.state==="edit"&&d.addClass("selected"),d.bind("click",function(){if(b.options.state==="edit"){b._disableEdit(),d.html(c[b.options.state]);return}b._enableEdit(),d.html(c[b.options.state])})},_enableToolbar:function(){var a=this;this.element.bind("midgardtoolbarstatechange",function(b,c){Modernizr.sessionstorage&&sessionStorage.setItem(a.options.storagePrefix+"Midgard.create.toolbar",c.display),a._setOption("toolbar",c.display)}),this.element.midgardToolbar({display:this.options.toolbar,vie:this.vie})},_enableEdit:function(){this._setOption("state","edit");var b=this,c={toolbarState:b.options.display,disabled:!1,vie:b.vie,widgets:b.options.editorWidgets,editorOptions:b.options.editorOptions};b.options.enableEditor&&(c[enableEditor]=b.options.enableEditor),b.options.disableEditor&&(c[disableEditor]=b.options.disableEditor),a("[about]",this.element).each(function(){var d=this;if(b.options.highlight){var e=function(a,c){if(c.entityElement.get(0)!==d)return;c.element.effect("highlight",{color:b.options.highlightColor},3e3)};a(this).bind("midgardeditableenableproperty",e)}a(this).bind("midgardeditabledisable",function(){a(this).unbind("midgardeditableenableproperty",e)}),a(this).midgardEditable(c)}),this._trigger("statechange",null,{state:"edit"})},_disableEdit:function(){var b=this,c={disabled:!0,vie:b.vie,editor:b.options.editor,editorOptions:b.options.editorOptions};b.options.enableEditor&&(c[enableEditor]=b.options.enableEditor),b.options.disableEditor&&(c[disableEditor]=b.options.disableEditor),a("[about]",this.element).each(function(){a(this).midgardEditable(c).removeClass("ui-state-disabled")}),this._setOption("state","browse"),this._trigger("statechange",null,{state:"browse"})}})})(jQuery),function(a,b){a.widget("Midgard.midgardEditable",{options:{editables:[],model:null,editorOptions:{},widgets:{Text:"halloWidget","default":"halloWidget"},toolbarState:"full",widgetName:function(a){var b="default",c=this.model.get("@type");return c&&c.attributes&&c.attributes.get(a.property)&&(b=c.attributes.get(a.property).range[0]),this.widgets[b]?this.widgets[b]:this.widgets["default"]},enableEditor:function(b){var c=this.widgetName(b);b.disabled=!1;if(typeof a(b.element)[c]!="function")throw new Error(c+" widget is not available");return a(b.element)[c](b),a(b.element).data("createWidgetName",c),a(b.element)},disableEditor:function(b){var c=a(b.element).data("createWidgetName");b.disabled=!0,c&&(a(b.element)[c](b),a(b.element).removeClass("ui-state-disabled"))},addButton:null,enable:function(){},enableproperty:function(){},disable:function(){},activated:function(){},deactivated:function(){},changed:function(){},vie:null,enableCollectionAdd:!0},_create:function(){this.vie=this.options.vie;if(!this.options.model){var a=this;this.vie.load({element:this.element}).from("rdfa").execute().done(function(b){a.options.model=b[0]})}},_init:function(){if(this.options.disabled){this.disable();return}this.enable()},enable:function(){var b=this;if(!this.options.model)return;this.vie.service("rdfa").findPredicateElements(this.options.model.id,a("[property]",this.element),!1).each(function(){return b._enableProperty(a(this))}),this._trigger("enable",null,{instance:this.options.model,entityElement:this.element});if(!this.options.enableCollectionAdd)return;_.forEach(this.vie.service("rdfa").views,function(a){a instanceof b.vie.view.Collection&&b._enableCollection(a)})},disable:function(){var b=this;a.each(this.options.editables,function(c,d){b.options.disableEditor({widget:b,editable:d,entity:b.options.model,element:a(this)})}),this.options.editables=[],this.options.addButton&&(this.options.addButton.remove(),delete this.options.addButton),this._trigger("disable",null,{instance:this.options.model,entityElement:this.element})},_enableProperty:function(a){var b=this,c=this.vie.service("rdfa").getElementPredicate(a);if(!c)return!0;if(this.options.model.get(c)instanceof Array)return!0;var d=this.options.enableEditor({widget:this,element:a,entity:this.options.model,property:c,editorOptions:this.options.editorOptions,toolbarState:this.options.toolbarState,vie:this.vie,modified:function(d){var e={};e[c]=d,b.options.model.set(e,{silent:!0}),b._trigger("changed",null,{property:c,instance:b.options.model,element:a,entityElement:b.element})},activated:function(){b._trigger("activated",null,{property:c,instance:b.options.model,element:a,entityElement:b.element})},deactivated:function(){b._trigger("deactivated",null,{property:c,instance:b.options.model,element:a,entityElement:b.element})}});this._trigger("enableproperty",null,{editable:d,property:c,instance:this.options.model,element:a,entityElement:this.element}),this.options.editables.push(d)},_enableCollection:function(b){var c=this;if(!b.owner||b.owner.getSubject()!==c.options.model.getSubject())return;if(c.options.addButton)return;if(b.template.length===0)return;b.collection.url=c.options.model.url(),b.bind("add",function(b){a(b.el).midgardEditable({disabled:c.options.disabled,model:b.model,vie:c.vie,widgets:c.options.widgets})}),b.collection.bind("add",function(a){a.primaryCollection=b.collection,c.vie.entities.add(a),a.collection=b.collection}),b.bind("remove",function(a){}),c.options.addButton=a('<button class="btn"><i class="icon-plus"></i> Add</button>').button(),c.options.addButton.addClass("midgard-create-add"),c.options.addButton.click(function(){b.collection.add({})}),a(b.el).after(c.options.addButton)}})}(jQuery),function(a,b){a.widget("Create.editWidget",{options:{disabled:!1,vie:null},enable:function(){this.element.attr("contenteditable","true")},disable:function(a){this.element.attr("contenteditable","false")},_create:function(){this._registerWidget(),this._initialize()},_init:function(){if(this.options.disabled){this.disable();return}this.enable()},_initialize:function(){var b=this,c=this.element.html();this.element.bind("blur keyup paste",function(d){if(b.options.disabled)return;var e=a(this).html();c!==e&&(c=e,b.options.modified(e))})},_registerWidget:function(){this.element.data("createWidgetName",this.widgetName)}})}(jQuery),function(a,b){a.widget("Create.alohaWidget",a.Create.editWidget,{enable:function(){this._initialize(),this.options.disabled=!1},disable:function(){try{options.editable.destroy()}catch(a){}this.options.disabled=!0},_initialize:function(){var a=this.options,b=new Aloha.Editable(Aloha.jQuery(a.element.get(0)));b.vieEntity=a.entity,Aloha.bind("aloha-editable-activated",function(){a.activated()}),Aloha.bind("aloha-editable-deactivated",function(){a.deactivated()}),Aloha.bind("aloha-smart-content-changed",function(){if(!b.isModified())return!0;a.modified(b.getContents()),b.setUnmodified()})}})}(jQuery),function(a,b){a.widget("Create.halloWidget",a.Create.editWidget,{options:{disabled:!0,toolbarState:"full",vie:null},enable:function(){a(this.element).hallo({editable:!0}),this.options.disabled=!1},disable:function(){a(this.element).hallo({editable:!1}),this.options.disabled=!0},_initialize:function(){a(this.element).hallo(this.getHalloOptions());var b=this;a(this.element).bind("halloactivated",function(a,c){b.options.activated()}),a(this.element).bind("hallodeactivated",function(a,c){b.options.deactivated()}),a(this.element).bind("hallomodified",function(a,c){b.options.modified(c.content),c.editable.setUnmodified()}),a(document).bind("midgardtoolbarstatechange",function(c,d){if(d.display===b.options.toolbarState)return;b.options.toolbarState=d.display,a(b.element).hallo(b.getHalloOptions())})},getHalloOptions:function(){var b={plugins:{halloformat:{},halloblock:{},hallolists:{}},buttonCssClass:"create-ui-btn-small",placeholder:"["+this.options.property+"]"};typeof this.element.annotate=="function"&&this.options.vie.services.stanbol&&(b.plugins.halloannotate={vie:this.options.vie}),this.options.toolbarState==="full"?(b.parentElement=a(".create-ui-toolbar-dynamictoolarea .create-ui-tool-freearea"),b.showAlways=!0,b.fixed=!0):(b.showAlways=!1,b.fixed=!1);var c={};return this.options.editorOptions[this.options.property]?c=this.options.editorOptions[this.options.property]:this.options.editorOptions["default"]&&(c=this.options.editorOptions["default"]),_.extend(b,c)}})}(jQuery),function(a,b){var c=[],d=function(b,d){var e={class_prefix:"midgardNotifications",timeout:3e3,auto_show:!0,body:"",bindTo:null,gravity:"T",effects:{onShow:function(a,b){a.animate({opacity:"show"},600,b)},onHide:function(a,b){a.animate({opacity:"hide"},600,b)}},actions:[],callbacks:{}},f={},g={},h=null,i=null,j=null,k=b,l=null,m={constructor:function(a){f=$.extend(e,a||{}),g={container:f.class_prefix+"-container",item:{wrapper:f.class_prefix+"-item",arrow:f.class_prefix+"-arrow",disregard:f.class_prefix+"-disregard",content:f.class_prefix+"-content",actions:f.class_prefix+"-actions",action:f.class_prefix+"-action"}},this._generate()},getId:function(){return i},getElement:function(){return h},_generate:function(){var b=this,d,e,j=null;h=d=a('<div class="'+g.item.wrapper+'-outer"/>'),d.css({display:"none"}),e=a('<div class="'+g.item.wrapper+'-inner"/>'),e.appendTo(d);if(f.bindTo){d.addClass(g.item.wrapper+"-binded");var m=a('<div class="'+g.item.arrow+'"/>');m.appendTo(d)}else d.addClass(g.item.wrapper+"-normal");j=a('<div class="'+g.item.content+'"/>'),j.html(f.body),j.appendTo(e);if(f.actions.length){var n=a('<div class="'+g.item.actions+'"/>');n.appendTo(e),a.each(f.actions,function(c,d){var e=a('<button name="'+d.name+'" class="button-'+d.name+'">'+d.label+"</button>").button();e.bind("click",function(a){l?d.cb(a,l,b):d.cb(a,b)}),n.append(e)})}h.bind("click",function(a){f.callbacks.onClick?f.callbacks.onClick(a,b):l||b.close()}),f.auto_show&&this.show(),this._setPosition(),i=c.push(this),k.append(h)},_setPosition:function(){if(f.bindTo){var b=h.width()?h.width():280,d=h.height()?h.height():109;j=a(f.bindTo);var e=j.outerWidth(),i=j.outerHeight(),k=j.offset().left,l=j.offset().top;switch(f.gravity){case"TL":properties={left:k,top:l+i+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_TL");break;case"TR":properties={left:k+e-b+"px",top:l+i+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_TR");break;case"BL":properties={left:k+"px",top:l-d+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_BL");break;case"BR":properties={left:k+e-b+"px",top:l-d+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_BR");break;case"LT":properties={left:k+e+"px",top:l+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_LT");break;case"LB":properties={left:k+e+"px",top:l+i-d+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_LB");break;case"RT":properties={left:k-b+"px",top:l+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_RT");break;case"RB":properties={left:k-b+"px",top:l+i-d+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_RB");break;case"T":properties={left:k+e/2-b/2+"px",top:l+i+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_T");break;case"R":properties={left:k-b+"px",top:l+i/2-d/2+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_R");break;case"B":properties={left:k+e/2-b/2+"px",top:l-d+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_B");break;case"L":properties={left:k+e+"px",top:l+i/2-d/2+"px"},h.find("."+g.item.arrow).addClass(g.item.arrow+"_L")}properties.position="absolute",h.css(properties);return}f.position||(f.position="top right");var m=a(".create-ui-toolbar-wrapper").outerHeight(!0)+6;pos={position:"fixed"};var n=function(b){var c=0;return a.each(b,function(a,b){if(!b)return;c+=b.getElement().height()}),c};f.position.match(/top/)&&(pos.top=m+n(c)+"px"),f.position.match(/bottom/)&&(pos.bottom=c.length-1*item.height()+item.height()+10+"px"),f.position.match(/right/)&&(pos.right="20px"),f.position.match(/left/)&&(pos.left="20px"),h.css(pos)},show:function(){var b=this,c,d,e,g,i,j;f.callbacks.beforeShow&&f.callbacks.beforeShow(b);if(f.bindTo){var k=a(f.bindTo);c=a(window).scrollTop(),d=a(window).scrollTop()+a(window).height(),g=parseFloat(h.offset().top,10),i=k.offset().top,j=k.outerHeight(),i<g&&(g=i),e=parseFloat(h.offset().top,10)+h.height(),i+j>e&&(e=i+j)}f.timeout>0&&!f.actions.length&&setTimeout(function(){b.close()},f.timeout),f.bindTo&&(g<c||g>d)||e<c||e>d?a("html, body").stop().animate({scrollTop:g},500,"easeInOutExpo",function(){f.effects.onShow(h,function(){f.callbacks.afterShow&&f.callbacks.afterShow(b)})}):f.effects.onShow(h,function(){f.callbacks.afterShow&&f.callbacks.afterShow(b)})},close:function(){var a=this;f.callbacks.beforeClose&&f.callbacks.beforeClose(a),f.effects.onHide(h,function(){f.callbacks.afterClose&&f.callbacks.afterClose(a),a.destroy()})},destroy:function(){var b=this;a.each(c,function(a,d){d&&d.getId()==b.getId()&&delete c[a]}),a(h).remove()},setStory:function(a){l=a},setName:function(a){h.addClass(g.item.wrapper+"-custom-"+a),this.name=a}};return m.constructor(d),delete m.constructor,m},e=function(b,c){var e={},f={},g={},h={},i=null,j=null,k=null,l={constructor:function(a){f=$.extend(e,a||{})},setStoryline:function(b){var c={content:"",actions:[],show_actions:!0,notification:{},back:null,back_label:null,forward:null,forward_label:null,beforeShow:null,afterShow:null,beforeClose:null,afterClose:null};g={},_current_item=null,i=null,j=null,k=null;var d=this;return a.each(b,function(b,e){var f=a.extend({},c,e);f.name=b;var h=a.extend({},c.notification,e.notification||{});h.body=f.content,h.auto_show=!1,f.actions.length&&(h.delay=0),h.callbacks={beforeShow:function(a){f.beforeShow&&f.beforeShow(a,d)},afterShow:function(a){f.afterShow&&f.afterShow(a,d)},beforeClose:function(a){f.beforeClose&&f.beforeClose(a,d)},afterClose:function(a){f.afterClose&&f.afterClose(a,d),i=a.name}},h.actions=[],f.show_actions&&(f.back&&(back_label=f.back_label,back_label||(back_label="Back"),h.actions.push({name:"back",label:back_label,cb:function(a,b,c){b.previous()}})),f.forward&&(forward_label=f.forward_label,forward_label||(forward_label="Back"),h.actions.push({name:"forward",label:forward_label,cb:function(a,b,c){b.next()}})),f.actions.length&&a.each(f.actions,function(a,b){h.actions.push(f.actions[a])})),j||(j=b),k=b,f.notification=h,g[b]=f}),g},start:function(){this._showNotification(g[j])},stop:function(){_current_item.close(),_current_item=null,i=null},next:function(){_current_item.close(),g[_current_item.name].forward?(next_item=g[_current_item.name].forward,this._showNotification(g[next_item])):this._showNotification(g[k])},previous:function(){i?(_current_item.close(),g[_current_item.name].back?(prev_item=g[_current_item.name].back,this._showNotification(g[prev_item])):this._showNotification(g[i])):this.stop()},_showNotification:function(b){return _current_item=new d(a("body"),b.notification),_current_item.setStory(this),_current_item.setName(b.name),_current_item.show(),_current_item}};return l.constructor(b),delete l.constructor,c&&l.setStoryline(c),l},f={start:{content:"Welcome to CreateJS tutorial!",forward:"toolbar_toggle",forward_label:"Start tutorial",actions:[{name:"quit",label:"Quit",cb:function(a,b,c){b.stop()}}]},toolbar_toggle:{content:"This is the CreateJS toolbars toggle button.<br />You can hide and show the full toolbar by clicking here.<br />Try it now.",forward:"edit_button",show_actions:!1,afterShow:function(b,c){a("body").bind("midgardtoolbarstatechange",function(b,d){d.display=="full"&&(c.next(),a("body").unbind("midgardtoolbarstatechange"))})},notification:{bindTo:"#midgard-bar-hidebutton",timeout:0,gravity:"TL"}},edit_button:{content:"This is the edit button.<br />Try it now.",show_actions:!1,afterShow:function(b,c){a("body").bind("midgardcreatestatechange",function(b,d){d.state=="edit"&&(c.next(),a("body").unbind("midgardcreatestatechange"))})},notification:{bindTo:".ui-button[for=midgardcreate-edit]",timeout:0,gravity:"TL"}},end:{content:"Thank you for watching!<br />Happy content editing times await you!"}};a.widget("Midgard.midgardNotifications",{options:{notification_defaults:{class_prefix:"midgardNotifications",position:"top right"}},_create:function(){this.classes={container:this.options.notification_defaults.class_prefix+"-container"},a("."+this.classes.container,this.element).length?(this.container=a("."+this.classes.container,this.element),this._parseFromDOM()):(this.container=a('<div class="'+this.classes.container+'" />'),this.element.append(this.container))},destroy:function(){this.container.remove(),$.Widget.prototype.destroy.call(this)},_init:function(){},_parseFromDOM:function(a){},showStory:function(a,b){var c=new e(a,b);return c.start(),c},create:function(b){return b=a.extend({},this.options.notification_defaults,b||{}),item=new d(this.container,b),item.show(),item},showTutorial:function(){this.showStory({},f)}})}(jQuery),function(a,b){a.widget("Midgard.midgardStorage",{options:{localStorage:!1,vie:null,changedModels:[],loaded:function(){},url:""},_create:function(){var b=this;Modernizr.localstorage&&(this.options.localStorage=!0),this.vie=this.options.vie,this.vie.entities.bind("add",function(a){a.url=b.options.url,a.toJSON=a.toJSONLD}),a("#midgardcreate-save").click(function(){b._saveRemote({success:function(){a("#midgardcreate-save").button({disabled:!0})},error:function(){}})}),b._bindEditables()},_bindEditables:function(){var b=this;b.element.bind("midgardeditablechanged",function(c,d){_.indexOf(b.options.changedModels,d.instance)===-1&&b.options.changedModels.push(d.instance),b._saveLocal(d.instance),a("#midgardcreate-save").button({disabled:!1})}),b.element.bind("midgardeditabledisable",function(c,d){b._restoreLocal(d.instance),a("#midgardcreate-save").hide()}),b.element.bind("midgardeditableenable",function(c,d){a("#midgardcreate-save").button({disabled:!0}),a("#midgardcreate-save").show(),!d.instance.isNew()&&b._checkLocal(d.instance)&&a("body").data("midgardCreate").showNotification({bindTo:"#midgardcreate-edit a",gravity:"TR",body:d.instance.getSubjectUri()+" has local modifications",timeout:0,actions:[{name:"restore",label:"Restore",cb:function(){b._readLocal(d.instance)}},{name:"ignore",label:"Ignore",cb:function(a,b){b.close()}}]}),_.each(d.instance.attributes,function(a,c){!(a instanceof b.vie.Collection)})}),b.element.bind("midgardstorageloaded",function(c,d){_.indexOf(b.options.changedModels,d.instance)===-1&&b.options.changedModels.push(d.instance),a("#midgardcreate-save").button({disabled:!1})})},_saveRemote:function(b){var c=this;c._trigger("save",null,{models:c.options.changedModels});var d=c.options.changedModels.length;d>1?notification_msg=d+" objects saved successfully":(subject=c.options.changedModels[0].getSubjectUri(),notification_msg="Object with subject "+subject+" saved successfully"),_.forEach(c.options.changedModels,function(e,f){e.save(null,{success:function(){e.originalAttributes&&delete e.originalAttributes,c._removeLocal(e),c.options.changedModels.splice(f,1),d--,d<=0&&(c._trigger("saved",null,{}),b.success(),a("body").data("midgardCreate").showNotification({body:notification_msg}))},error:function(c,d){notification_msg="Error occurred while saving",d.responseText&&(notification_msg=notification_msg+":<br />"+d.responseText),b.error(),a("body").data("midgardCreate").showNotification({body:notification_msg})}})})},_saveLocal:function(a){if(!this.options.localStorage)return;if(a.isNew()){if(!a.primaryCollection)return;return this._saveLocalReferences(a.primaryCollection.subject,a.primaryCollection.predicate,a)}localStorage.setItem(a.getSubjectUri(),JSON.stringify(a.toJSONLD()))},_getReferenceId:function(a,b){return a.id+":"+b},_saveLocalReferences:function(a,b,c){if(!this.options.localStorage)return;if(!a||!b)return;var d=this,e=a+":"+b,f=c.toJSONLD();if(localStorage.getItem(e)){var g=JSON.parse(localStorage.getItem(e)),h=_.pluck(g,"@").indexOf(f["@"]);h!==-1?g[h]=f:g.push(f),localStorage.setItem(e,JSON.stringify(g));return}localStorage.setItem(e,JSON.stringify([f]))},_checkLocal:function(a){if(!this.options.localStorage)return!1;var b=localStorage.getItem(a.getSubjectUri());return b?!0:!1},_readLocal:function(a){if(!this.options.localStorage)return;var b=localStorage.getItem(a.getSubjectUri());if(!b)return;a.originalAttributes||(a.originalAttributes=_.clone(a.attributes));var c=JSON.parse(b),d=this.vie.entities.addOrUpdate(c,{overrideAttributes:!0});this._trigger("loaded",null,{instance:d})},_readLocalReferences:function(a,b,c){if(!this.options.localStorage)return;var d=this._getReferenceId(a,b),e=localStorage.getItem(d);if(!e)return;c.add(JSON.parse(e))},_restoreLocal:function(b){var c=this;if(!b)return;_.each(b.attributes,function(a,b){a instanceof c.vie.Collection&&a.forEach(function(b){b.isNew()&&a.remove(b)})});if(a.isEmptyObject(b.changedAttributes())){b.originalAttributes&&(b.set(b.originalAttributes),delete b.originalAttributes);return}b.set(b.previousAttributes())},_removeLocal:function(a){if(!this.options.localStorage)return;localStorage.removeItem(a.getSubjectUri())}})}(jQuery),function(a,b){a.widget("Midgard.midgardTags",{options:{vie:null,entity:null,element:null,entityElement:null},_init:function(){this.vie=this.options.vie,this.entity=this.options.entity,this.element=this.options.element;var b=this.entity.getSubject(),c=b.replace(/[^A-Za-z]/g,"-");this.pane=a('<div class="hiddenfieldsContainer"><div class="hiddenfieldsToggle"></div><div class="hiddenfields"><div class="hiddenfieldsCloseButton"></div><h2>Article settings</h2><div id="articleTagsWrapper"><form><div class="articleTags"><h3>Article tags</h3><input type="text" id="'+c+'-articleTags" class="tags" value="" /></div><div class="articleSuggestedTags"><h3>Suggested tags</h3><input type="text" id="'+c+'-suggestedTags" class="tags" value="" /></div></form></div></div><div class="hiddenfieldsCloseCorner"></div></div>'),this.pane=this.pane.insertBefore(this.element),this.articleTags=this.pane.find(".articleTags input"),this.suggestedTags=this.pane.find(".articleSuggestedTags input"),this.pane.find(".hiddenfieldsToggle").click(function(b){var c=a(this).closest(".hiddenfieldsContainer");a(".hiddenfields",c).show(),a(".hiddenfieldsToggle",c).hide(),a(".hiddenfieldsCloseCorner",c).show(),a(".hiddenfieldsCloseButton",c).show()});var d=this;this.pane.find(".hiddenfieldsCloseCorner, .hiddenfieldsCloseButton").click(function(a){d.closeTags()}),a(document).click(function(b){a(b.target).closest(".hiddenfieldsContainer").size()===0&&a(".hiddenfieldsCloseCorner:visible").length>0&&d.closeTags()}),this.articleTags.tagsInput({width:"auto",height:"auto",onAddTag:function(a){var b=d.entity;b.isReference(a)||(a="urn:tag:"+a),b.attributes["<http://purl.org/dc/elements/1.1/subject>"].vie=d.vie,b.attributes["<http://purl.org/dc/elements/1.1/subject>"].addOrUpdate({"@subject":a})},onRemoveTag:function(a){d.entity.attributes["<http://purl.org/dc/elements/1.1/subject>"].remove(a)},label:this.tagLabel}),this.suggestedTags.tagsInput({width:"auto",height:"auto",interactive:!1,label:this.tagLabel,remove:!1}),a("#"+c+"-suggestedTags_tagsinput .tag span").live("click",function(){var b=a(this).text();return d.articleTags.addTag(a(this).data("value")),d.suggestedTags.removeTag($.trim(b)),!1}),this.loadTags()},closeTags:function(){var b=a(".hiddenfieldsContainer");a(".hiddenfields",b).hide(),a(".hiddenfieldsToggle",b).show(),a(".hiddenfieldsCloseCorner",b).hide(),a(".hiddenfieldsCloseButton",b).hide(),this.options.deactivated()},loadTags:function(){var b=this,c=this.entity.attributes["<http://purl.org/dc/elements/1.1/subject>"].models;a(c).each(function(){b.articleTags.addTag(this.id)}),b.vie.analyze({element:this.options.entityElement}).using(["stanbol"]).execute().success(function(c){return a(c).each(function(a,c){typeof c.attributes=="undefined"?c["<http://www.w3.org/2000/01/rdf-schema#label>"]&&b.suggestedTags.addTag(c["@subject"]):c.attributes["<rdfschema:label>"]&&b.suggestedTags.addTag(c.id)})}).fail(function(a){})},tagLabel:function(a){return a.substring(0,9)=="<urn:tag:"&&(a=a.substring(9,a.length-1)),a.substring(0,8)=="<http://"&&(a=a.substring(a.lastIndexOf("/")+1,a.length-1),a=a.replace(/_/g," ")),a}})}(jQuery),function(a,b){a.widget("Midgard.midgardToolbar",{options:{display:"full",statechange:function(){}},_create:function(){this.element.append(this._getMinimized()),this.element.append(this._getFull());var b=this;a(".create-ui-toggle").click(function(){b.options.display==="full"?(b.hide(),b.options.display="minimized"):(b.show(),b.options.display="full"),b._trigger("statechange",null,b.options)}),this._setDisplay(this.options.display),b=this,a(this.element).bind("midgardcreatestatechange",function(a,c){c.state=="browse"&&b._clearWorkflows()}),a(this.element).bind("midgardworkflowschanged",function(c,d){b._clearWorkflows(),d.workflows.length&&d.workflows.each(function(c){html=a("body").data().midgardWorkflows.prepareItem(d.instance,c,function(a,c){b._clearWorkflows();if(a)return}),a(".create-ui-tool-workflowarea",this.element).append(html)})})},_setOption:function(a,b){a==="display"&&this._setDisplay(b),this.options[a]=b},_setDisplay:function(b){b==="minimized"&&a("div.create-ui-toolbar-wrapper").hide()},hide:function(){a("div.create-ui-toolbar-wrapper").fadeToggle("fast","linear")},show:function(){a("div.create-ui-toolbar-wrapper").fadeToggle("fast","linear")},_getMinimized:function(){return a('<div class="create-ui-logo"><a class="create-ui-toggle" id="create-ui-toggle-toolbar"></a></div>')},_getFull:function(){return a('<div class="create-ui-toolbar-wrapper"><div class="create-ui-toolbar-toolarea"><div class="create-ui-toolbar-dynamictoolarea"><ul class="create-ui-dynamictools create-ui-toolset-1"><li class="create-ui-tool-workflowarea"></li><li class="create-ui-tool-freearea"></li></ul></div><div class="create-ui-toolbar-statustoolarea"><ul class="create-ui-statustools"></ul></div></div></div>')},_clearWorkflows:function(){a(".create-ui-tool-workflowarea",this.element).empty()}})}(jQuery),function(a,b){a.widget("Midgard.midgardWorkflows",{options:{url:function(a){},renderers:{button:function(b,c,d,e){return button_id="midgardcreate-workflow_"+c.get("name"),html=a('<button class="create-ui-btn" id="'+button_id+'">'+c.get("label")+"</button>").button(),html.bind("click",function(a){d(b,c,e)}),html}},action_types:{backbone_save:function(a,b,c){copy_of_url=a.url,original_model=a.clone(),original_model.url=copy_of_url,action=b.get("action"),action.url&&(a.url=action.url),original_model.save(null,{success:function(b){a.url=copy_of_url,a.change(),c(null,a)},error:function(b,d){a.url=copy_of_url,a.change(),c(d,a)}})},backbone_destroy:function(a,b,c){copy_of_url=a.url,original_model=a.clone(),original_model.url=copy_of_url,action=b.get("action"),action.url&&(a.url=action.url),a.destroy({success:function(b){a.url=copy_of_url,a.change(),c(null,b)},error:function(b,d){a.url=copy_of_url,a.change(),c(d,a)}})},http:function(b,c,d){action=c.get("action");if(!action.url)return d("No action url defined!");wf_opts={},action.http&&(wf_opts=action.http),ajax_options=a.extend({url:action.url,type:"POST",data:b.toJSON(),success:function(){b.fetch({success:function(a){d(null,a)},error:function(a,b){d(b,a)}})}},wf_opts),a.ajax(ajax_options)}}},_init:function(){this._renderers={},this._action_types={},this._parseRenderersAndTypes(),this._last_instance=null,this.ModelWorkflowModel=Backbone.Model.extend({defaults:{name:"",label:"",type:"button",action:{type:"backbone_save"}}}),this.workflows={};var b=this;a(this.element).bind("midgardeditableactivated",function(a,c){b._fetchWorkflows(c.instance)})},_fetchWorkflows:function(a){var b=this;if(a.isNew()){b._trigger("changed",null,{instance:a,workflows:[]});return}if(b._last_instance==a){b.workflows[a.cid]&&b._trigger("changed",null,{instance:a,workflows:b.workflows[a.cid]});return}b._last_instance=a;if(b.workflows[a.cid]){b._trigger("changed",null,{instance:a,workflows:b.workflows[a.cid]});return}b.options.url?b._fetchModelWorkflows(a):(flows=new(b._generateCollectionFor(a))([],{}),b._trigger("changed",null,{instance:a,workflows:flows}))},_parseRenderersAndTypes:function(){var b=this;a.each(this.options.renderers,function(a,c){b.setRenderer(a,c)}),a.each(this.options.action_types,function(a,c){b.setActionType(a,c)})},setRenderer:function(a,b){this._renderers[a]=b},getRenderer:function(a){return this._renderers[a]?this._renderers[a]:!1},setActionType:function(a,b){this._action_types[a]=b},getActionType:function(a){return this._action_types[a]},prepareItem:function(a,b,c){var d=this;return renderer=this.getRenderer(b.get("type")),action_type_cb=this.getActionType(b.get("action").type),renderer(a,b,action_type_cb,function(e,f){delete d.workflows[a.cid],d._last_instance=null,b.get("action").type!=="backbone_destroy"&&d._fetchModelWorkflows(a),c(e,f)})},_generateCollectionFor:function(a){var b={model:this.ModelWorkflowModel};return this.options.url&&(b.url=this.options.url(a)),Backbone.Collection.extend(b)},_fetchModelWorkflows:function(a){if(a.isNew())return;var b=this;b.workflows[a.cid]=new(this._generateCollectionFor(a))([],{}),b.workflows[a.cid].fetch({success:function(c){b.workflows[a.cid].reset(c.models),b._trigger("changed",null,{instance:a,workflows:b.workflows[a.cid]})},error:function(a,b){}})}})}(jQuery);