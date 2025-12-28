            <!-- Footer Start -->
            <div class="container-fluid pt-4 px-4">
                <div class="bg-white rounded-top p-4">
                    <div class="row">
                        <div class="col-12 col-sm-6 text-center text-sm-start">
                            &copy; <a href="https://www.instagram.com/owens.arg/" target="_blank">OWEN'S Argentina</a> Todos los derechos reservados. 
                        </div>
                        <div class="col-12 col-sm-6 text-center text-sm-end">
                            Diseñado por Paradiso</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Footer End -->
        </div>
        <!-- Content End -->



    </div>

    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{asset('')}}lib/chart/chart.min.js"></script>
    <script src="{{asset('')}}lib/easing/easing.min.js"></script>
    <script src="{{asset('')}}lib/waypoints/waypoints.min.js"></script>
    <script src="{{asset('')}}lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="{{asset('')}}lib/tempusdominus/js/moment.min.js"></script>
    <script src="{{asset('')}}lib/tempusdominus/js/moment-timezone.min.js"></script>
    <script src="{{asset('')}}lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js"></script>

    <!-- Template Javascript -->
    <script src="{{asset('')}}js/main.js"></script>

    <script>
        // Dark Mode Logic
        const toggleBtn = document.getElementById('darkModeToggle');
        const icon = toggleBtn.querySelector('i');
        const body = document.body;
        const logo = document.getElementById('sidebarLogo');
        const lightLogo = "{{ asset('img/owens.png') }}";
        const darkLogo = "{{ asset('img/owens-darkmode.png') }}";

        // Check LocalStorage
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            if(logo) logo.src = darkLogo;
        }

        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                if(logo) logo.src = darkLogo;
            } else {
                localStorage.setItem('darkMode', 'disabled');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                if(logo) logo.src = lightLogo;
            }
        });
    </script>
</body>

</html>