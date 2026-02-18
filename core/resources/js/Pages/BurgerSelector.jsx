import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import '../../css/burger-selector.css';

// Static Data
const burgerNames = ["CHEESE BURGER", "BACON BURGER", "BACON CRISPY", "AMERICAN BURGER"];

const extraItems = [
    { id: 'extraPapas', label: '+ Extra Papas' },
    { id: 'extraBacon', label: '+ Extra Bacon' },
    { id: 'extraCheddar', label: '+ Extra Cheddar' },
    { id: 'coke', label: '+ Lata de Coca Cola' },
    { id: 'extraSalsaAjo', label: '+ Extra Salsa de Ajo' },
];

const combos = [
    {
        id: 1,
        name: "COMBO 1",
        desc: "X2 CHEESE SIMPLES + PAPAS + LATA DE COCA COLA",
        price: "$17.500"
    },
    {
        id: 3,
        name: "COMBO 3",
        desc: "X2 AMERICAN/BACON DOBLES + PAPAS + LATA DE COCA COLA",
        price: "$19.500"
    },
    {
        id: 2,
        name: "COMBO 2",
        desc: "X3 SIMPLES A ELECCIÓN + PAPAS + X3 LATAS DE COCA COLA",
        price: "$29.500"
    },
    {
        id: 4,
        name: "COMBO 4",
        desc: "AMERICAN/BACON DOBLE + PAPAS + LATA DE COCA COLA",
        price: "$10.500"
    },
    {
        id: 5,
        name: "COMBO 5",
        desc: "AMERICAN/BACON SIMPLE + PAPAS + LATA DE COCA COLA",
        price: "$9.500"
    }
];

export default function BurgerSelector() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [burgerSize, setBurgerSize] = useState(0); // 0: Simple, 1: Double, 2: Triple
    const [currentBurgerIndex, setCurrentBurgerIndex] = useState(0); // 0: Cheese, 1: Bacon, 2: American
    const [showCombos, setShowCombos] = useState(false);
    const [selectedCombo, setSelectedCombo] = useState(null);

    // Extras State
    const [extras, setExtras] = useState({
        extraPapas: 0,
        extraBacon: 0,
        extraCheddar: 0,
        coke: 0,
        extraSalsaAjo: 0
    });

    const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' or 'delivery'
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('transfer'); // 'cash' or 'transfer'
    const [observations, setObservations] = useState('');

    // Cart System
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);


    const addToCart = () => {
        const burgerName = burgerNames[currentBurgerIndex] || "CUSTOM BURGER";

        const currentItem = {
            id: Date.now(),
            type: selectedCombo ? 'combo' : 'burger',
            name: selectedCombo
                ? combos.find(c => c.id === selectedCombo)?.name
                : burgerName,
            description: selectedCombo
                ? combos.find(c => c.id === selectedCombo)?.desc
                : `${burgerSize === 0 ? 'Simple' : burgerSize === 1 ? 'Doble' : 'Triple'}`,
            size: burgerSize, // using burgerSize state, not 'size' which was undefined
            extras: { ...extras },
            price: 0 // Placeholder as we don't have prices yet
        };

        setCart(prev => [...prev, currentItem]);

        // Open cart
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
        if (cart.length <= 1) setIsCartOpen(false);
    };

    const updateCartItemExtra = (itemId, extraId, change) => {
        setCart(prev => prev.map(item => {
            if (item.id !== itemId) return item;

            const currentCount = item.extras[extraId] || 0;
            const newCount = Math.max(0, currentCount + change);

            return {
                ...item,
                extras: {
                    ...item.extras,
                    [extraId]: newCount
                }
            };
        }));
    };

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;

        let message = "Hola! Quiero hacer un pedido:\n\n";

        // Cart Details
        message += "*DETALLE DEL PEDIDO*:\n";
        cart.forEach(item => {
            message += `- 1x ${item.name} (${item.description})\n`;
            Object.entries(item.extras).forEach(([key, count]) => {
                if (count > 0) {
                    message += `  + ${extraItems.find(e => e.id === key)?.label} x${count}\n`;
                }
            });
        });

        // Delivery Method
        message += `\n*MÉTODO DE ENTREGA*: ${deliveryMethod === 'delivery' ? 'Envío a Domicilio' : 'Retiro en Local'}\n`;
        if (deliveryMethod === 'delivery') {
            message += `*DIRECCIÓN*: ${address || 'No especificada'}\n`;
        }

        // Payment Method
        message += `\n*MÉTODO DE PAGO*: ${paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}\n`;

        // Observations
        if (observations) {
            message += `\n*OBSERVACIONES*: ${observations}\n`;
        }

        const encodedMessage = encodeURIComponent(message);
        const url = `https://api.whatsapp.com/send/?phone=5493765365090&text=${encodedMessage}&type=phone_number&app_absent=0`;

        window.open(url, '_blank');
    };

    const getTotalItems = () => cart.length;


    const handleExtraClick = (id) => {
        setExtras(prev => ({
            ...prev,
            [id]: prev[id] + 1
        }));
    };

    const handleRemoveExtra = (e, id) => {
        e.stopPropagation();
        setExtras(prev => ({
            ...prev,
            [id]: Math.max(0, prev[id] - 1)
        }));
    };


    useEffect(() => {
        document.body.classList.add('burger-selector-page');

        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        const setDiagonalBackground = () => {
            const isMobile = window.innerWidth < 768;
            const textColor = darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.025)';

            // Adjust dimensions and font size for mobile
            const patternWidth = isMobile ? '200' : '400';
            const patternHeight = isMobile ? '100' : '200';
            const fontSize = isMobile ? '24' : '48';
            const textY = isMobile ? '40' : '80';

            const svgString = `<svg id="diagtext" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%">
                <style type="text/css">
                    text { fill: ${textColor}; font-family: Inter, Poppins, Arial, sans-serif; font-weight: 600; }
                </style>
                <defs>
                    <pattern id="owenspattern" patternUnits="userSpaceOnUse" width="${patternWidth}" height="${patternHeight}">
                        <text y="${textY}" font-size="${fontSize}" id="owenstext">@owens.arg</text>
                    </pattern>
                    <pattern id="combo" xlink:href="#owenspattern" patternTransform="rotate(-45)">
                        <use xlink:href="#owenstext" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#combo)" />
            </svg>`;
            document.body.style.backgroundImage = `url('data:image/svg+xml;base64,${window.btoa(svgString)}')`;
        };

        setDiagonalBackground();
        window.addEventListener('resize', setDiagonalBackground);

        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        gsapScript.async = true;

        const draggableScript = document.createElement('script');
        draggableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Draggable.min.js';
        draggableScript.async = true;

        gsapScript.onload = () => {
            document.head.appendChild(draggableScript);
            draggableScript.onload = initBurgerAnimation;
        };

        document.head.appendChild(gsapScript);

        return () => {
            document.body.classList.remove('burger-selector-page');
            document.body.classList.remove('dark-mode');
            document.body.style.backgroundImage = '';
            window.removeEventListener('resize', setDiagonalBackground);
            if (window.burgerCleanup) window.burgerCleanup();
        };
    }, [darkMode]);

    // Update animations when size changes
    useEffect(() => {
        if (window.updateBurgerState && window.currentBurgerId !== undefined) {
            window.updateBurgerState(window.currentBurgerId);
        }
    }, [burgerSize]);

    const initBurgerAnimation = () => {
        const { gsap } = window;
        const select = (s) => document.querySelector(s);
        const selectAll = (s) => document.querySelectorAll(s);

        const burgerSVG = select('.burgerSVG');
        const dragHit = select('.dragHit');
        const tomatoGroup = select('.tomatoGroup');
        const lettuce = select('.lettuce');
        const cheeseGroup = select('.cheeseGroup');
        const pickleGroup = select('.pickleGroup');
        const bacon = select('.bacon');
        const crispyOnionGroup = select('.crispyOnionGroup');
        const bunTop = select('.bunTop');
        const burgerGroup = select('.burgerGroup');
        const meatPatty2 = select('.meatPatty2');
        const meatPatty3 = select('.meatPatty3');

        const initPos = { x: 141 };
        const maxPos = { x: 541 };
        const dragRange = maxPos.x - initPos.x;
        const numStages = 3;
        const step = dragRange / numStages;

        let currentId = -1;
        window.currentBurgerId = 0;

        // Initialize state
        gsap.set('.burgerSVG', { visibility: 'visible' });

        if (!gsap.isTweening(burgerGroup)) {
            if (!burgerGroup.style.transform) {
                gsap.set(burgerGroup, { y: 150, x: initPos.x });
            } else {
                gsap.set(burgerGroup, { y: 150 });
            }
        }

        gsap.set(bunTop, { y: 68 });

        // Initial visibility
        gsap.set([cheeseGroup, bacon, tomatoGroup, lettuce, '.filling', pickleGroup.querySelectorAll('rect'), crispyOnionGroup], { opacity: 0 });
        gsap.set('.meatPatty', { opacity: 1 });

        window.updateBurgerState = (id) => {
            const duration = 0.2;
            const ease = "power2.out";

            // Get current size from DOM since we are in a closure
            const container = document.querySelector('.burger-selector-container');
            const size = parseInt(container?.getAttribute('data-size') || '0');

            const offsetPerPatty = 12;
            const yOffset = -(size * offsetPerPatty);

            // Update extra patties
            gsap.to(meatPatty2, { opacity: size >= 1 ? 1 : 0, duration, ease });
            gsap.to(meatPatty3, { opacity: size >= 2 ? 1 : 0, duration, ease });

            // Ingredients reset
            if (id !== 1 && id !== 2) { // 1 is Bacon, 2 is Bacon Crispy
                gsap.to(bacon, { opacity: 0, duration, ease });
            }

            if (id !== 2) {
                gsap.to(crispyOnionGroup, { opacity: 0, duration, ease });
            }

            // Tomato and Lettuce always move to their position based on size, only opacity changes
            gsap.to(tomatoGroup, { y: 35 + yOffset, duration, ease });
            gsap.to(lettuce, { y: 43 + yOffset, duration, ease });

            if (id !== 3) {
                gsap.to(tomatoGroup, { opacity: 0, duration, ease });
                gsap.to(lettuce, { opacity: 0, duration, ease });
            } else {
                gsap.to(tomatoGroup, { opacity: 1, duration, ease });
                gsap.to(lettuce, { opacity: 1, duration, ease });
                gsap.to(bunTop, { y: 49 + yOffset, duration, ease });
            }

            // Common elements - apply offset
            gsap.to(cheeseGroup, { opacity: 1, y: 14 + yOffset, duration, ease });

            if (id === 0 || id === 3) {
                gsap.to(pickleGroup.querySelectorAll('rect'), { opacity: 1, y: 18 + yOffset, duration, ease });
            } else {
                gsap.to(pickleGroup.querySelectorAll('rect'), { opacity: 0, duration, ease });
            }

            // Adjust crispy onion position
            if (id === 2) {
                gsap.to(crispyOnionGroup, { opacity: 1, y: 32 + yOffset, duration, ease });
            }

            if (id === 0) { // CHEESE
                gsap.to(bunTop, { y: 66 + yOffset, duration, ease });
            } else if (id === 1) { // BACON
                gsap.to(bacon, { opacity: 1, y: 29 + yOffset, duration, ease });
                gsap.to(bunTop, { y: 66 + yOffset, duration, ease });
            } else if (id === 2) { // BACON CRISPY
                gsap.to(bacon, { opacity: 1, y: 29 + yOffset, duration, ease });
                // Crispy onions directly above bacon
                gsap.to(bunTop, { y: 60 + yOffset, duration, ease });
            } else if (id === 3) { // AMERICAN
                // Already handled above
            }

            // Update text visibility
            gsap.to('.filling', { y: 0, duration, ease });
            selectAll('.filling').forEach((el, i) => {
                gsap.to(el, { opacity: i === id ? 1 : 0, duration, ease });
            });

            // Update arrows visibility
            gsap.to('.arrowL-group', { autoAlpha: id === 0 ? 0 : 1, duration, ease });
            gsap.to('.arrowR-group', { autoAlpha: id === 3 ? 0 : 1, duration, ease });
        };

        const syncState = () => {
            const currentX = gsap.getProperty(burgerGroup, 'x');
            const percent = (currentX - initPos.x) / dragRange;
            let id = Math.round(percent * numStages);
            id = Math.max(0, Math.min(id, numStages));

            if (currentId === id) return;

            currentId = id;
            window.currentBurgerId = id;
            window.updateBurgerState(id);
            setCurrentBurgerIndex(id); // Sync with React state
        };

        const navigateToBurger = (direction) => {
            const nextId = Math.max(0, Math.min(currentId + direction, numStages));
            if (nextId === currentId) return;

            const targetX = nextId * step + initPos.x;
            gsap.to(burgerGroup, {
                x: targetX,
                duration: 0.4,
                ease: "power2.out",
                onUpdate: syncState
            });
        };

        const setDraggable = () => {
            if (window.Draggable.get(burgerGroup)) return;

            window.Draggable.create(burgerGroup, {
                type: 'x',
                trigger: dragHit,
                bounds: { minX: initPos.x, maxX: maxPos.x },
                onDrag: syncState,
                onRelease: function () {
                    const percent = (this.x - initPos.x) / dragRange;
                    let endId = Math.round(percent * numStages);
                    endId = Math.max(0, Math.min(endId, numStages));
                    const endX = endId * step + initPos.x;

                    gsap.to(this.target, {
                        x: endX,
                        duration: 0.3,
                        ease: "power2.out",
                        onUpdate: syncState
                    });
                },
                cursor: 'pointer',
            });

            syncState();
            window.updateBurgerState(currentId === -1 ? 0 : currentId);
        };

        setDraggable();

        const onArrowLClick = () => navigateToBurger(-1);
        const onArrowRClick = () => navigateToBurger(1);
        const onKeyDown = (e) => {
            if (e.key === 'ArrowLeft') navigateToBurger(-1);
            if (e.key === 'ArrowRight') navigateToBurger(1);
        };

        select('.arrowL-group').addEventListener('click', onArrowLClick);
        select('.arrowR-group').addEventListener('click', onArrowRClick);
        window.addEventListener('keydown', onKeyDown);

        if (window.burgerCleanup) window.burgerCleanup();
        window.burgerCleanup = () => {
            if (window.Draggable.get(burgerGroup)) {
                window.Draggable.get(burgerGroup).kill();
            }
            select('.arrowL-group')?.removeEventListener('click', onArrowLClick);
            select('.arrowR-group')?.removeEventListener('click', onArrowRClick);
            window.removeEventListener('keydown', onKeyDown);
            window.updateBurgerState = null;
        };
    };

    const handleComboClick = () => {
        if (showCombos) {
            setShowCombos(false);
            setSelectedCombo(null); // Reset selection
        } else {
            setShowCombos(true);
        }
    };

    const handleSelectCombo = (id) => {
        if (selectedCombo === id) {
            setSelectedCombo(null); // Deselect if same
        } else {
            setSelectedCombo(id);
        }
    };

    return (
        <>
            <Head title="Elegí tu Hamburguesa" />
            <div className="burger-selector-container" data-size={burgerSize}>

                {/* Burger Section - Disabled when combo is selected */}
                <div className={`burger-section ${selectedCombo ? 'disabled' : ''}`}>
                    <div className="burger-visual">
                        <svg
                            className="burgerSVG"
                            viewBox="0 0 800 600"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMin meet"
                        >
                            <defs>
                                <linearGradient id="redGrad" x1="400" y1="593.7" x2="400" y2="155.33" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.43" stopColor="#252121" />
                                    <stop offset="1" stopColor="#fc5a51" />
                                </linearGradient>
                                <path id="arrow" d="M15 0 L5 10 L15 20" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </defs>

                            <text x="50%" y="60" className="choose">
                                ELEGÍ TU HAMBURGUESA
                            </text>

                            <g className="arrowL-group" style={{ cursor: 'pointer' }}>
                                <rect x="50" y="150" width="120" height="120" fill="transparent" />
                                <use className="arrowL arrow" xlinkHref="#arrow" x="100" y="200" style={{ pointerEvents: 'none' }} />
                            </g>

                            <g className="arrowR-group" transform="rotate(180 670 210)" style={{ cursor: 'pointer' }}>
                                <rect x="610" y="150" width="120" height="120" fill="transparent" />
                                <use className="arrowR arrow" xlinkHref="#arrow" x="660" y="200" style={{ pointerEvents: 'none' }} />
                            </g>

                            <g className="burgerGroup">
                                <g className="burgerScale">
                                    <path className="bunBot" d="M5.5,110.3h104a0,0,0,0,1,0,0V117a9.34,9.34,0,0,1-9.34,9.34H14.84A9.34,9.34,0,0,1,5.5,117V110.3A0,0,0,0,1,5.5,110.3Z" fill="#ffca63" />

                                    {/* Meat Patties */}
                                    <rect className="meatPatty" x="2" y="100" width="111" height="10" rx="5" ry="5" fill="#8B4513" stroke="#6B3410" strokeWidth="1" />
                                    <rect className="meatPatty2" x="2" y="88" width="111" height="10" rx="5" ry="5" fill="#8B4513" stroke="#6B3410" strokeWidth="1" style={{ opacity: 0 }} />
                                    <rect className="meatPatty3" x="2" y="76" width="111" height="10" rx="5" ry="5" fill="#8B4513" stroke="#6B3410" strokeWidth="1" style={{ opacity: 0 }} />

                                    <g className="cheeseGroup">
                                        <rect className="slice" x="2" y="81.8" width="111" height="5" rx="2.5" ry="2.5" fill="#FCDF6C" />
                                        <polygon className="hang" points="49.5 85.3 69.5 99.3 88.5 85.3 49.5 85.3" fill="#FCDF6C" />
                                    </g>

                                    {/* Crispy Onions - Small oval rings scattered */}
                                    <g className="crispyOnionGroup">
                                        {/* Row of small crispy onion rings */}
                                        <ellipse cx="12" cy="58" rx="8" ry="3" fill="none" stroke="#C8860A" strokeWidth="2.5" />
                                        <ellipse cx="30" cy="56" rx="9" ry="3.5" fill="none" stroke="#D4A017" strokeWidth="2.5" />
                                        <ellipse cx="48" cy="58" rx="7" ry="3" fill="none" stroke="#B8860B" strokeWidth="2.5" />
                                        <ellipse cx="65" cy="56" rx="10" ry="3.5" fill="none" stroke="#C8860A" strokeWidth="2.5" />
                                        <ellipse cx="83" cy="58" rx="8" ry="3" fill="none" stroke="#D4A017" strokeWidth="2.5" />
                                        <ellipse cx="100" cy="56" rx="7" ry="3" fill="none" stroke="#B8860B" strokeWidth="2.5" />
                                        {/* Subtle fill for depth */}
                                        <ellipse cx="12" cy="58" rx="8" ry="3" fill="#F5DEB3" opacity="0.4" />
                                        <ellipse cx="30" cy="56" rx="9" ry="3.5" fill="#F5DEB3" opacity="0.4" />
                                        <ellipse cx="48" cy="58" rx="7" ry="3" fill="#F5DEB3" opacity="0.4" />
                                        <ellipse cx="65" cy="56" rx="10" ry="3.5" fill="#F5DEB3" opacity="0.4" />
                                        <ellipse cx="83" cy="58" rx="8" ry="3" fill="#F5DEB3" opacity="0.4" />
                                        <ellipse cx="100" cy="56" rx="7" ry="3" fill="#F5DEB3" opacity="0.4" />
                                    </g>

                                    <g className="pickleGroup">
                                        <rect x="4.5" y="72.8" width="20.84" height="5" fill="#cdf953" />
                                        <rect x="32.89" y="72.8" width="20.84" height="5" fill="#cdf953" />
                                        <rect x="61.28" y="72.8" width="20.84" height="5" fill="#cdf953" />
                                        <rect x="89.66" y="72.8" width="20.84" height="5" fill="#cdf953" />
                                    </g>
                                    <path className="bacon" d="M0,62.8c9.58,0,9.58,4,19.17,4s9.58-4,19.16-4,9.58,4,19.17,4,9.58-4,19.17-4,9.59,4,19.17,4,9.59-4,19.17-4" fill="none" stroke="#f4a4d2" strokeMiterlimit="10" strokeWidth="5" />
                                    <g className="tomatoGroup">
                                        <rect x="6.31" y="47.3" width="45.95" height="8" fill="#ffb7b3" stroke="#fc5a51" strokeMiterlimit="10" strokeWidth="4" />
                                        <rect x="62.74" y="47.3" width="45.95" height="8" fill="#ffb7b3" stroke="#fc5a51" strokeMiterlimit="10" strokeWidth="4" />
                                    </g>

                                    <path class="lettuce" d="M2,31.3c5.55,0,5.55,8,11.1,8s5.55-8,11.1-8,5.55,8,11.1,8,5.55-8,11.1-8,5.55,8,11.1,8,5.55-8,11.1-8,5.55,8,11.1,8,5.55-8,11.1-8,5.55,8,11.11,8,5.55-8,11.11-8" fill="none" stroke="#5af96c" stroke-linejoin="bevel" stroke-width="5" />                                        <g className="bunTop">
                                        <path d="M109.5,24.65H5.5S9.62,0,57.5,0C103.32,0,109.5,24.65,109.5,24.65Z" fill="#ffca63" fillRule="evenodd" />
                                        <path fill="#FDE7BD" d="M43.08,11.78a2.57,2.57,0,1,1-2.57-2.57A2.57,2.57,0,0,1,43.08,11.78Zm34,0a2.57,2.57,0,1,1-2.57-2.57A2.57,2.57,0,0,1,77.06,11.78Zm-17,0A2.57,2.57,0,1,1,57.5,9.21,2.57,2.57,0,0,1,60.07,11.78Zm8.5-5.15A2.57,2.57,0,1,1,66,4.06,2.57,2.57,0,0,1,68.57,6.63Zm-17,0A2.57,2.57,0,1,1,49,4.06,2.57,2.57,0,0,1,51.58,6.63Z" />
                                    </g>
                                </g>
                                {/* Ingredient labels inside burgerGroup so they move with it */}
                                <text x="57" y="155" className="filling" textAnchor="middle">CHEESE</text>
                                <text x="57" y="155" className="filling" textAnchor="middle">BACON</text>
                                <text x="57" y="155" className="filling" textAnchor="middle">BACON CRISPY</text>
                                <text x="57" y="155" className="filling" textAnchor="middle">AMERICAN</text>
                                <rect className="dragHit" width="118" height="228" fill="transparent" />
                            </g>


                        </svg>
                    </div>

                    <div className="size-selector-wrapper">
                        <div className="size-selector">
                            <button
                                className={`size-btn ${burgerSize === 0 ? 'active' : ''}`}
                                onClick={() => setBurgerSize(0)}
                            >
                                Simple
                            </button>
                            <button
                                className={`size-btn ${burgerSize === 1 ? 'active' : ''}`}
                                onClick={() => setBurgerSize(1)}
                            >
                                Doble
                            </button>
                            <button
                                className={`size-btn ${burgerSize === 2 ? 'active' : ''}`}
                                onClick={() => setBurgerSize(2)}
                            >
                                Triple
                            </button>
                        </div>
                        <div className="fries-included-msg">*Las hamburguesas vienen con papas fritas y salsa de ajo incluidas</div>
                    </div>

                    {/* Extras Section */}
                    <div className="extras-wrapper">
                        <div className="extras-container">
                            {extraItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`extra-btn ${extras[item.id] > 0 ? 'active' : ''}`}
                                    onClick={() => handleExtraClick(item.id)}
                                >
                                    {item.label}
                                    {extras[item.id] > 0 && (
                                        <>
                                            <span className="extra-count">({extras[item.id]})</span>
                                            <div
                                                className="extra-remove"
                                                onClick={(e) => handleRemoveExtra(e, item.id)}
                                            >
                                                -
                                            </div>
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="combo-text-container">
                    <h2 className="combo-title" onClick={handleComboClick}>
                        O ELEGÍ UN COMBO
                    </h2>
                </div>

                {/* Combos Section - Inline Minimalist */}
                <div className={`combo-container ${showCombos ? 'visible' : ''}`}>
                    <div className="combo-list">
                        {combos.map((combo) => (
                            <div
                                key={combo.id}
                                className={`combo-item ${selectedCombo === combo.id ? 'selected' : ''}`}
                                onClick={() => handleSelectCombo(combo.id)}
                            >
                                <span className="combo-name">{combo.name}</span>
                                <span className="combo-separator">-</span>
                                <span className="combo-description">{combo.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Method Section */}
                <div className="section-container" style={{ marginTop: '40px', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div className="section-title">MÉTODO DE ENTREGA</div>
                    <div className="options-row">
                        <button
                            className={`option-btn ${deliveryMethod === 'pickup' ? 'active' : ''}`}
                            onClick={() => {
                                setDeliveryMethod('pickup');
                            }}
                        >
                            Retiro en Local
                        </button>
                        <button
                            className={`option-btn ${deliveryMethod === 'delivery' ? 'active' : ''}`}
                            onClick={() => {
                                setDeliveryMethod('delivery');
                                if (paymentMethod === 'cash') setPaymentMethod('transfer');
                            }}
                        >
                            Envío a Domicilio
                        </button>
                    </div>

                    {deliveryMethod === 'delivery' && (
                        <div className="input-group">
                            <input
                                type="text"
                                className="text-input"
                                placeholder="Ingresá tu dirección exacta..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Payment Method Section */}
                <div className="section-container">
                    <div className="section-title">MÉTODO DE PAGO</div>
                    <div className="options-row">
                        <button
                            className={`option-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('cash')}
                            disabled={deliveryMethod === 'delivery'}
                            style={{ opacity: deliveryMethod === 'delivery' ? 0.5 : 1, cursor: deliveryMethod === 'delivery' ? 'not-allowed' : 'pointer' }}
                        >
                            Efectivo
                            {deliveryMethod === 'delivery' && <span className="small-note"> (Solo retiro)</span>}
                        </button>
                        <button
                            className={`option-btn ${paymentMethod === 'transfer' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('transfer')}
                        >
                            Transferencia
                        </button>
                    </div>
                </div>

                {/* Observations Section */}
                <div className="section-container" style={{ marginBottom: '60px' }}>
                    <div className="section-title">OBSERVACIONES</div>
                    <div className="input-group">
                        <textarea
                            className="text-input textarea"
                            placeholder="Algo que debamos saber? (ej. Sin pepinillos, sin sal...)"
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="fab-container">
                <button className="fab-cart" onClick={() => setIsCartOpen(true)}>
                    {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </button>
                <button className="fab-add" onClick={addToCart}>
                    <span className="plus-icon">+</span>
                    <span className="add-text">AGREGAR</span>
                </button>
            </div>

            {/* Cart Modal */}
            {isCartOpen && (
                <div className="cart-modal-overlay" onClick={() => setIsCartOpen(false)}>
                    <div className="cart-modal" onClick={e => e.stopPropagation()}>
                        <div className="cart-header">
                            <h3>TU PEDIDO</h3>
                            <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
                        </div>
                        <div className="cart-items">
                            {cart.map((item, index) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-info">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-desc">{item.description}</div>
                                        {Object.entries(item.extras).map(([key, count]) => count > 0 && (
                                            <div key={key} className="item-extra-control">
                                                <div className="extra-label-row">
                                                    {extraItems.find(e => e.id === key)?.label}
                                                </div>
                                                <div className="extra-stepper">
                                                    <button className="extra-stepper-btn" onClick={(e) => { e.stopPropagation(); updateCartItemExtra(item.id, key, -1); }}>-</button>
                                                    <span className="extra-stepper-value">{count}</span>
                                                    <button className="extra-stepper-btn" onClick={(e) => { e.stopPropagation(); updateCartItemExtra(item.id, key, 1); }}>+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                </div>
                            ))}
                            {cart.length === 0 && <div className="empty-cart">Tu carrito está vacío</div>}
                        </div>
                        <div className="cart-footer">
                            <button className="place-order-btn" onClick={handlePlaceOrder}>
                                HACER PEDIDO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
