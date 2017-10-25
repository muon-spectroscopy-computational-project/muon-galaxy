"use strict";define(["libs/toastr","mvc/library/library-model","mvc/library/library-dataset-view"],function(t,e,i){return{FolderRowView:Backbone.View.extend({events:{"click .undelete_dataset_btn":"undeleteDataset","click .undelete_folder_btn":"undeleteFolder","click .edit_folder_btn":"startModifications","click .cancel_folder_btn":"cancelModifications","click .save_folder_btn":"saveModifications"},defaults:{type:null,visibility_config:{edit_folder_btn:!1,save_folder_btn:!1,cancel_folder_btn:!1,permission_folder_btn:!1},edit_mode:!1},initialize:function(t){this.options=_.defaults(t||{},this.defaults),this.render(this.options)},render:function(t){this.options=_.extend(this.options,t);var e=this.options.model,i=null;return"folder"===e.get("type")||"LibraryFolder"===e.get("model_class")?(this.options.type="folder",this.prepareButtons(e),i=e.get("deleted")?this.templateRowDeletedFolder():this.templateRowFolder()):"file"===e.get("type")||"LibraryDatasetDatasetAssociation"===e.get("model_class")||"LibraryDataset"===e.get("model_class")?(this.options.type="file",i=e.get("deleted")?this.templateRowDeletedFile():this.templateRowFile()):(Galaxy.emit.error("Unknown library item type found."),Galaxy.emit.error(e.get("type")||e.get("model_class"))),this.setElement(i({content_item:e,edit_mode:this.options.edit_mode,button_config:this.options.visibility_config})),this.$el.show(),this},prepareButtons:function(t){var e=this.options.visibility_config;!1===this.options.edit_mode?(e.save_folder_btn=!1,e.cancel_folder_btn=!1,!0===t.get("deleted")?(e.edit_folder_btn=!1,e.permission_folder_btn=!1):!1===t.get("deleted")&&(e.save_folder_btn=!1,e.cancel_folder_btn=!1,!0===t.get("can_modify")&&(e.edit_folder_btn=!0),!0===t.get("can_manage")&&(e.permission_folder_btn=!0))):!0===this.options.edit_mode&&(e.edit_folder_btn=!1,e.permission_folder_btn=!1,e.save_folder_btn=!0,e.cancel_folder_btn=!0),this.options.visibility_config=e},showDatasetDetails:function(){Galaxy.libraries.datasetView=new i.LibraryDatasetView({id:this.id})},undeleteDataset:function(i){$(".tooltip").hide();var o=this,a=$(i.target).closest("tr").data("id"),n=Galaxy.libraries.folderListView.collection.get(a);n.url=n.urlRoot+n.id+"?undelete=true",n.destroy({success:function(i,n){Galaxy.libraries.folderListView.collection.remove(a);var l=new e.Item(n);Galaxy.libraries.folderListView.collection.add(l),Galaxy.libraries.folderListView.collection.sortFolder("name","asc"),t.success("Dataset undeleted. Click this to see it.","",{onclick:function(){var t=o.model.get("folder_id");window.location=Galaxy.root+"library/list#folders/"+t+"/datasets/"+o.id}})},error:function(e,i){void 0!==i.responseJSON?t.error("Dataset was not undeleted. "+i.responseJSON.err_msg):t.error("An error occured! Dataset was not undeleted. Please try again.")}})},undeleteFolder:function(i){$(".tooltip").hide();var o=$(i.target).closest("tr").data("id"),a=Galaxy.libraries.folderListView.collection.get(o);a.url=a.urlRoot+a.id+"?undelete=true",a.destroy({success:function(i,a){Galaxy.libraries.folderListView.collection.remove(o);var n=new e.FolderAsModel(a);Galaxy.libraries.folderListView.collection.add(n),Galaxy.libraries.folderListView.collection.sortFolder("name","asc"),t.success("Folder undeleted.")},error:function(e,i){void 0!==i.responseJSON?t.error("Folder was not undeleted. "+i.responseJSON.err_msg):t.error("An error occured! Folder was not undeleted. Please try again.")}})},startModifications:function(){this.options.edit_mode=!0,this.repaint()},cancelModifications:function(){this.options.edit_mode=!1,this.repaint()},saveModifications:function(){var e=Galaxy.libraries.folderListView.collection.get(this.$el.data("id")),i=!1,o=this.$el.find(".input_folder_name").val();if(void 0!==o&&o!==e.get("name")){if(!(o.length>2))return void t.warning("Folder name has to be at least 3 characters long.");e.set("name",o),i=!0}var a=this.$el.find(".input_folder_description").val();if(void 0!==a&&a!==e.get("description")&&(e.set("description",a),i=!0),i){var n=this;e.save(null,{patch:!0,success:function(e){n.options.edit_mode=!1,n.repaint(e),t.success("Changes to folder saved.")},error:function(e,i){void 0!==i.responseJSON?t.error(i.responseJSON.err_msg):t.error("An error occured while attempting to update the folder.")}})}else this.options.edit_mode=!1,this.repaint(e),t.info("Nothing has changed.")},repaint:function(){$(".tooltip").hide();var t=this.$el;this.render(),t.replaceWith(this.$el),this.$el.find("[data-toggle]").tooltip()},templateRowFolder:function(){return _.template(['<tr class="folder_row light library-row" data-id="<%- content_item.id %>">',"<td>",'<span title="Folder" class="fa fa-folder-o"/>',"</td>",'<td style="text-align: center; "><input style="margin: 0;" type="checkbox"></td>',"<% if(!edit_mode) { %>","<td>",'<a href="#folders/<%- content_item.id %>"><%- content_item.get("name") %></a>',"</td>","<td>",'<%- content_item.get("description") %>',"</td>","<td></td>","<% } else if(edit_mode){ %>",'<td><textarea rows="4" class="form-control input_folder_name" placeholder="name" ><%- content_item.get("name") %></textarea></td>','<td><textarea rows="4" class="form-control input_folder_description" placeholder="description" ><%- content_item.get("description") %></textarea></td>',"<% } %>","<td>folder</td>","<td>",'<%= _.escape(content_item.get("update_time")) %>',"</td>","<td></td>","<td>","<% if(edit_mode) { %>",'<button data-toggle="tooltip" data-placement="top" title="Save changes" class="primary-button btn-xs save_folder_btn" type="button" style="<% if(button_config.save_folder_btn === false) { print("display:none;") } %>">','<span class="fa fa-floppy-o"/> Save',"</button>",'<button data-toggle="tooltip" data-placement="top" title="Discard changes" class="primary-button btn-xs cancel_folder_btn" type="button" style="<% if(button_config.cancel_folder_btn === false) { print("display:none;") } %>">','<span class="fa fa-times"/> Cancel',"</button>","<% } else if (!edit_mode){%>",'<button data-toggle="tooltip" data-placement="top" title="Modify \'<%- content_item.get("name") %>\'" class="primary-button btn-xs edit_folder_btn" type="button" style="<% if(button_config.edit_folder_btn === false) { print("display:none;") } %>">','<span class="fa fa-pencil"/> Edit',"</button>",'<a href="#/folders/<%- content_item.id %>/permissions">','<button data-toggle="tooltip" data-placement="top" class="primary-button btn-xs permission_folder_btn" title="Permissions of \'<%- content_item.get("name") %>\'" style="<% if(button_config.permission_folder_btn === false) { print("display:none;") } %>">','<span class="fa fa-group"/> Manage',"</button>","</a>","<% } %>","</td>","</tr>"].join(""))},templateRowFile:function(){return _.template(['<tr class="dataset_row light library-row" data-id="<%- content_item.id %>">',"<td>",'<span title="Dataset" class="fa fa-file-o"/>',"</td>",'<td style="text-align: center; ">','<input style="margin: 0;" type="checkbox">',"</td>","<td>",'<a href="#folders/<%- content_item.get("folder_id") %>/datasets/<%- content_item.id %>" class="library-dataset">','<%- content_item.get("name") %>',"<a>","</td>",'<td><%- content_item.get("message") %></td>','<td><%= _.escape(content_item.get("file_ext")) %></td>','<td><%= _.escape(content_item.get("file_size")) %></td>','<td><%= _.escape(content_item.get("update_time")) %></td>',"<td>",'<% if ( content_item.get("state") !== "ok" ) { %>','<%= _.escape(content_item.get("state")) %>',"<% } %>","</td>","<td>",'<% if (content_item.get("is_unrestricted")) { %>','<span data-toggle="tooltip" data-placement="top" title="Unrestricted dataset" style="color:grey;" class="fa fa-globe fa-lg"/>',"<% } %>",'<% if (content_item.get("is_private")) { %>','<span data-toggle="tooltip" data-placement="top" title="Private dataset" style="color:grey;" class="fa fa-key fa-lg"/>',"<% } %>",'<% if ((content_item.get("is_unrestricted") === false) && (content_item.get("is_private") === false)) { %>','<span data-toggle="tooltip" data-placement="top" title="Restricted dataset" style="color:grey;" class="fa fa-shield fa-lg"/>',"<% } %>",'<% if (content_item.get("can_manage")) { %>','<a href="#folders/<%- content_item.get("folder_id") %>/datasets/<%- content_item.id %>/permissions">','<button data-toggle="tooltip" data-placement="top" class="primary-button btn-xs permissions-dataset-btn" title="Permissions of \'<%- content_item.get("name") %>\'">','<span class="fa fa-group"/> Manage',"</button>","</a>","<% } %>","</td>","</tr>"].join(""))},templateRowDeletedFile:function(){return _.template(['<tr class="active deleted_dataset library-row" data-id="<%- content_item.id %>">',"<td>",'<span title="Dataset" class="fa fa-file-o"/>',"</td>","<td></td>",'<td style="color:grey;">','<%- content_item.get("name") %>',"</td>","<td>",'<%- content_item.get("message") %>',"</td>","<td>",'<%= _.escape(content_item.get("file_ext")) %>',"</td>","<td>",'<%= _.escape(content_item.get("file_size")) %>',"</td>","<td>",'<%= _.escape(content_item.get("update_time")) %>',"</td>","<td>",'<% if ( content_item.get("state") !== "ok" ) { %>','<%= _.escape(content_item.get("state")) %>',"<% } %>","</td>","<td>",'<span data-toggle="tooltip" data-placement="top" title="Marked deleted" style="color:grey;" class="fa fa-ban fa-lg"/>','<button data-toggle="tooltip" data-placement="top" title="Undelete \'<%- content_item.get("name") %>\'" class="primary-button btn-xs undelete_dataset_btn" type="button" style="margin-left:1em;">','<span class="fa fa-unlock"/> Undelete',"</button>","</td>","</tr>"].join(""))},templateRowDeletedFolder:function(){return _.template(['<tr class="active deleted_folder light library-row" data-id="<%- content_item.id %>">',"<td>",'<span title="Folder" class="fa fa-folder-o"/>',"</td>","<td></td>",'<td style="color:grey;">','<%- content_item.get("name") %>',"</td>","<td>",'<%- content_item.get("description") %>',"</td>","<td>","folder","</td>","<td></td>","<td>",'<%= _.escape(content_item.get("update_time")) %>',"</td>","<td></td>","<td>",'<span data-toggle="tooltip" data-placement="top" title="Marked deleted" style="color:grey;" class="fa fa-ban fa-lg"/>','<button data-toggle="tooltip" data-placement="top" title="Undelete \'<%- content_item.get("name") %>\'" class="primary-button btn-xs undelete_folder_btn" type="button" style="margin-left:1em;">','<span class="fa fa-unlock"/> Undelete',"</button>","</td>","</tr>"].join(""))}})}});
//# sourceMappingURL=../../../maps/mvc/library/library-folderrow-view.js.map
