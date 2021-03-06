import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';
declare var $:any;
import { UserRole } from 'src/app/core/dictionary/user-role';
@Component({
    selector: 'app-product-sidebar',
    templateUrl: 'product-sidebar.component.html',
})

export class ProductSidebarComponent implements OnInit {
    userCurrentRole = '';
    userRoles = UserRole;
    constructor(public storageService: StorageService) {

    }
    ngOnInit() {
        this.userCurrentRole = this.storageService.getData('user_data').user_role;
    }
    ngAfterViewInit() {
      $(document).ready(function() {
          // Toggle the side navigation
          $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
              $("body").toggleClass("sidebar-toggled");
              $(".sidebar").toggleClass("toggled");
              if ($(".sidebar").hasClass("toggled")) {
                  $('.sidebar .collapse').collapse('hide');
              };
          });
          $(document).click(function(e) {
            if (!$(e.target).is('.container-fluid')) {
                $('.sidebar .collapse').collapse('hide');	    
            }
          });
          // Close any open menu accordions when window is resized below 768px
          $(window).resize(function() {
              if ($(window).width() < 768) {
                  $('.sidebar .collapse').collapse('hide');
              };
  
              // Toggle the side navigation when window is resized below 480px
              if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
                  $("body").addClass("sidebar-toggled");
                  $(".sidebar").addClass("toggled");
                  $('.sidebar .collapse').collapse('hide');
              };
          });
  
          // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
          $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
              if ($(window).width() > 768) {
                  var e0 = e.originalEvent,
                      delta = e0.wheelDelta || -e0.detail;
                  this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                  e.preventDefault();
              }
          });
      });
  }
}
