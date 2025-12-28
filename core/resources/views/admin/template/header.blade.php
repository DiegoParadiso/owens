
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Owens Argentina</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="Simple Cashier App For Your bussiness" name="keywords">
    <meta content="Simple Cashier App For Your bussiness" name="description">

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('img/favicon/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('img/favicon/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('img/favicon/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ asset('img/favicon/site.webmanifest') }}">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="{{asset('')}}lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="{{asset('')}}lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css" rel="stylesheet" />
    <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet"> 

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
</head>

<body>
    <div class="container-xxl position-relative d-flex p-0" style="background: var(--light);">
        <!-- Dark Mode Toggle -->
        <button id="darkModeToggle" class="btn btn-lg-square position-fixed top-0 end-0 m-3" style="z-index: 9999; background: transparent; border: none; color: var(--text-main);">
            <i class="fa fa-moon" style="font-size: 1.5rem;"></i>
        </button>