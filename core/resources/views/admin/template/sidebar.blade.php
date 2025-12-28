  <!-- Sidebar Start -->
  <div class="sidebar pe-4 pb-3">
      <nav class="navbar navbar-light">
        <a href="{{ route('dashboard') }}" class="navbar-brand mx-auto mb-3 d-flex justify-content-center w-100">
            <img id="sidebarLogo" src="{{ asset('img/owens.png') }}" alt="Owens Logo" style="width: 150px; height: auto;">
        </a>
          <div class="d-flex align-items-center ms-4 mb-4">
              <div class="position-relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 rounded-circle" style="width: 40px; height: 40px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <div class="bg-success rounded-circle border-2 border-white position-absolute end-0 bottom-0 p-1">
                  </div>
              </div>
              <div class="ms-3">
                  <h6 class="mb-0">{{ Auth::user()->name }}</h6>
                  <span>{{ Auth::user()->role }}</span>
              </div>
          </div>
          <div class="navbar-nav w-100">
              <!-- Dashboard -->
              <a href="{{ route('dashboard') }}"
                  class="nav-item nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                  <i class="fa fa-tachometer-alt me-2"></i>Dashboard
              </a>

              <!-- Cash Register -->
              <a href="{{ route('cash_register.index') }}"
                  class="nav-item nav-link {{ request()->routeIs('cash_register.*') ? 'active' : '' }}">
                  <i class="fa fa-cash-register me-2"></i>Caja
              </a>

              <!-- Products (Inventory) -->
              <a href="{{ route('product.index') }}"
                  class="nav-item nav-link {{ (request()->routeIs('product.*') && !request()->routeIs('product.createCombo') && !request()->routeIs('product.indexCombo')) ? 'active' : '' }}">
                  <i class="fa fa-box me-2"></i>Inventario
              </a>

              <!-- Combos -->
              <a href="{{ route('product.indexCombo') }}"
                  class="nav-item nav-link {{ (request()->routeIs('product.createCombo') || request()->routeIs('product.indexCombo')) ? 'active' : '' }}">
                  <i class="fa fa-utensils me-2"></i>Combos
              </a>



              <!-- Sales -->
              <a href="{{ route('sales.index') }}"
                  class="nav-item nav-link {{ request()->routeIs('sales.*') ? 'active' : '' }}">
                  <i class="fa fa-shopping-cart me-2"></i>Ventas
              </a>

              <!-- Suppliers -->
              <a href="{{ route('supplier.index') }}"
                  class="nav-item nav-link {{ request()->routeIs('supplier.*') ? 'active' : '' }}">
                  <i class="fa fa-truck me-2"></i>Proveedores
              </a>

              <!-- Purchases -->
              <a href="{{ route('purchase.index') }}"
                  class="nav-item nav-link {{ request()->routeIs('purchase.*') ? 'active' : '' }}">
                  <i class="fa fa-shopping-bag me-2"></i>Compras
              </a>

              <!-- Expenses -->
              <a href="{{ route('expense.index') }}"
                  class="nav-item nav-link {{ request()->routeIs('expense.*') ? 'active' : '' }}">
                  <i class="fa fa-money-bill-wave me-2"></i>Gastos
              </a>

              <!-- Reports -->
              <a href="{{ route('report.index') }}"
                  class="nav-item nav-link {{ request()->routeIs('report.*') ? 'active' : '' }}">
                  <i class="fa fa-chart-line me-2"></i>Reportes
              </a>
              <!-- Logout -->
              <a href="{{ route('logout') }}" class="nav-item nav-link">
                  <i class="fa fa-sign-out-alt me-2"></i>Cerrar Sesión
              </a>
          </div>
      </nav>
  </div>
  <!-- Sidebar End -->

  <!-- Sidebar Toggler (Arrow) -->
  <div class="sidebar-toggler-container" style="cursor: pointer;">
     <div class="sidebar-toggler d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
        <i class="fa fa-chevron-left text-dark transition-transform" id="sidebar-arrow" style="font-size: 1.5rem;"></i>
     </div>
  </div>


  <!-- Content Start -->
  <div class="content">
      <!-- Navbar Removed -->

      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

