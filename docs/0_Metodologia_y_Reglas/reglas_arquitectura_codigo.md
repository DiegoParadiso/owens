# Principios de diseño y organización del código

## Objetivo

Diseñar software modular, comprensible y modificable. La prioridad no es producir la mayor cantidad posible de clases, interfaces o carpetas, sino reducir la complejidad que un desarrollador debe conocer para entender y modificar una parte del sistema.

Estos principios se aplican como criterios de diseño, no como un checklist mecánico. No introducir abstracciones, capas, interfaces o patrones sin que exista una razón arquitectónica.

## 1. Modularidad e información oculta

Seguir el principio de información oculta de David Parnas.

Cada módulo debe ocultar decisiones de diseño que puedan cambiar:

* estructura interna de datos;
* algoritmos;
* fuente de datos;
* formato de persistencia;
* APIs externas;
* detalles del framework;
* mecanismos de autenticación;
* mecanismos de infraestructura.

La interfaz pública debe expresar qué puede hacer el módulo, no cómo lo hace.

Los consumidores no deben depender de:

* estructuras internas;
* consultas SQL;
* ORM específico;
* formatos de archivos;
* detalles de almacenamiento;
* algoritmos internos;
* clases concretas innecesarias.

Un `private` no constituye por sí solo una buena encapsulación. Un conjunto de getters/setters para todos los atributos tampoco constituye necesariamente una buena abstracción.

## 2. Módulos profundos

Seguir el criterio de John Ousterhout.

Preferir módulos que proporcionen una cantidad significativa de funcionalidad mediante una interfaz simple.

Evitar módulos superficiales cuya interfaz sea casi tan compleja como su implementación.

No dividir una clase o función únicamente para hacerla más pequeña.

No crear:

* clases de un solo método sin responsabilidad real;
* interfaces con un único método únicamente para "cumplir SOLID";
* wrappers que no oculten ninguna complejidad;
* capas Service → Repository → Service innecesarias;
* abstracciones que solamente reenvían llamadas.

Una clase de 300 líneas puede estar mejor diseñada que cinco clases de 60 líneas si la primera encapsula correctamente una responsabilidad compleja.

Evaluar la calidad de un módulo por la complejidad que elimina del resto del sistema, no por su cantidad de líneas.

## 3. Cohesión

Mantener juntas las cosas que pertenecen al mismo concepto, responsabilidad o eje de cambio.

Las piezas que suelen modificarse juntas deberían estar físicamente próximas cuando sea posible.

Evitar agrupar código únicamente por tipo técnico:

```
controllers/
services/
repositories/
models/
```

Cuando el dominio lo permita, preferir organización por feature, componente o contexto:

```
orders/
products/
customers/
payments/
```

Una feature debe poder localizarse sin recorrer múltiples capas del proyecto.

## 4. Package by Feature

Cuando sea apropiado, organizar el código alrededor de capacidades funcionales del sistema.

Ejemplo:

```
features/
    orders/
    customers/
    products/
```

Cada feature puede contener internamente sus propias capas:

```
orders/
    presentation/
    domain/
    data/
```

La organización externa debe expresar el dominio o las capacidades del sistema; la organización interna puede expresar las capas necesarias.

No crear una estructura profunda de carpetas si la cantidad de código no la justifica.

## 5. Vertical Slice

Cuando el sistema se modifica principalmente mediante casos de uso independientes, considerar Vertical Slice Architecture.

Ejemplo:

```
features/
    orders/
        create-order/
        cancel-order/
        get-order/
        list-orders/
```

Cada slice puede contener todo lo necesario para implementar su caso de uso.

La unidad de organización debe seguir el eje real de cambio del sistema.

No imponer Vertical Slice si las características del proyecto hacen que una arquitectura por capas o por componentes sea más clara.

## 6. Capas

La separación Presentation / Domain / Data es válida cuando reduce complejidad.

Mantener separadas:

```
Presentation
    ↓
Domain
    ↓
Data / Infrastructure
```

La lógica de negocio no debe depender innecesariamente de UI, HTTP, SQL, ORM o frameworks.

Las capas son una herramienta de modularización, no una obligación de crear una carpeta para cada tipo de clase.

No introducir una capa adicional solamente porque una arquitectura de referencia la utiliza.

## 7. Dependencias

Las dependencias deben ser explícitas y controladas.

Evitar dependencias circulares.

Evitar que módulos de alto nivel conozcan detalles de módulos de bajo nivel cuando una abstracción adecuada permita invertir la dependencia.

El dominio no debe conocer detalles de infraestructura si estos pueden mantenerse detrás de una interfaz estable.

No permitir que una feature acceda arbitrariamente a los detalles internos de otra feature.

Preferir:

```
Feature A → interfaz pública de Feature B
```

sobre:

```
Feature A → repositorio interno de Feature B
```

## 8. SOLID

Aplicar SOLID como criterios para resolver problemas reales de diseño.

### SRP
Una unidad debe tener una responsabilidad coherente y una razón de cambio clara.

### OCP
El diseño debe permitir extender comportamientos sin modificar continuamente código estable cuando exista una variación previsible.

### LSP
Las implementaciones deben respetar las expectativas contractuales de la abstracción que implementan.

### ISP
Los consumidores no deberían depender de interfaces que contienen operaciones que no necesitan.

### DIP
El código de alto nivel no debe quedar acoplado innecesariamente a detalles concretos de infraestructura.
No crear interfaces artificiales únicamente para cumplir DIP.

## 9. GRASP

Utilizar GRASP para decidir dónde colocar responsabilidades.

Preguntar antes de crear una nueva clase:

* ¿Quién tiene la información necesaria? → Information Expert.
* ¿Quién debería crear este objeto? → Creator.
* ¿Quién coordina esta operación del sistema? → Controller.
* ¿Qué solución minimiza el acoplamiento? → Low Coupling.
* ¿Qué solución mantiene responsabilidades relacionadas juntas? → High Cohesion.
* ¿Qué objeto representa adecuadamente una abstracción cuando no existe un candidato natural? → Pure Fabrication.
* ¿Qué solución protege al dominio de una variación concreta? → Indirection / Protected Variations.

GRASP decide principalmente quién debe asumir una responsabilidad; SOLID ayuda a evaluar la estructura resultante.

## 10. Composición sobre herencia

Preferir composición cuando la relación no sea verdaderamente "is-a".
Usar herencia cuando exista una relación conceptual y contractual clara y la sustitución sea válida.
Evitar jerarquías creadas solamente para reutilizar código.

Preferir:
```
Order
  └── PaymentPolicy
```
antes que crear múltiples subclases de Order únicamente para reutilizar comportamiento.

## 11. Ley de Demeter

Evitar cadenas de conocimiento innecesarias.

Preferir:
```
order.calculateTotal()
```
sobre:
```
order.getCustomer().getAccount().getDiscount().getValue()
```
cuando esas llamadas revelen la estructura interna de objetos.
Un objeto debería colaborar principalmente con objetos que conoce directamente.

## 12. Bounded Context

Cuando diferentes partes del sistema tienen modelos, reglas o ciclos de cambio diferentes, no asumir que deben compartir las mismas clases.
Evaluar límites conceptuales antes de crear entidades globales reutilizadas por todo el sistema.
Un mismo término puede representar conceptos diferentes en diferentes contextos.
Evitar modelos globales gigantes que obliguen a múltiples módulos a compartir conocimiento innecesario.

## 13. Estructura de carpetas

La estructura física debe reflejar la arquitectura lógica.
Una carpeta no crea encapsulación por sí misma.

Si una arquitectura requiere límites fuertes, reforzarlos mediante mecanismos del lenguaje:
* visibilidad;
* módulos;
* namespaces;
* interfaces;
* exports;
* reglas de lint;
* dependencias permitidas;
* tests arquitectónicos.

No crear carpetas como:
```
utils/
helpers/
common/
misc/
```
para evitar decidir a qué módulo pertenece un comportamiento. Cada archivo debe tener una ubicación explicable por su responsabilidad.

## 14. Shared / Common

El código compartido debe demostrar que realmente pertenece a un concepto transversal y estable.
No mover código a `shared/` simplemente porque dos módulos lo utilizan.

Antes de compartir algo, preguntar:
1. ¿Los módulos realmente comparten el mismo concepto?
2. ¿Cambiará por las mismas razones?
3. ¿Su contrato debe ser común?
4. ¿Compartirlo reduce complejidad o aumenta acoplamiento?

La duplicación pequeña y localizada puede ser preferible a crear una abstracción compartida prematura.

## 15. Cambios

Antes de modificar código, identificar:
* qué módulo debería poseer la responsabilidad;
* qué conocimiento está siendo utilizado;
* qué dependencias serán introducidas;
* qué partes deberían permanecer ignorantes de la implementación;
* qué código cambia por la misma razón;
* si el cambio aumenta el acoplamiento.

Preferir cambios localizados.
Si una modificación aparentemente pequeña requiere cambiar muchos módulos no relacionados, considerar que existe un problema de diseño y evaluar una refactorización antes de continuar.

## 16. Anti-patrones

Evitar:
* código spaghetti;
* God Objects;
* God Services;
* God Controllers;
* clases que solamente almacenan datos y exponen getters/setters cuando deberían encapsular comportamiento;
* `utils` como depósito indiscriminado;
* interfaces creadas únicamente para cumplir SOLID;
* repositorios y servicios creados automáticamente sin necesidad;
* abstracciones de una sola implementación sin una variación que las justifique;
* dependencia directa del dominio respecto de infraestructura;
* dependencias circulares;
* imports entre detalles internos de features;
* herencia utilizada únicamente para reutilización;
* carpetas organizadas únicamente por tipo técnico cuando esto dispersa una misma feature;
* duplicación de conocimiento sobre una misma decisión de diseño;
* cadenas largas de getters;
* funciones o clases divididas artificialmente para cumplir métricas.

## 17. Regla general de decisión

Ante dos diseños posibles, preferir el que:
1. oculta más conocimiento;
2. tiene interfaces más simples;
3. mantiene juntas las cosas que cambian juntas;
4. minimiza dependencias entre módulos;
5. reduce el conocimiento que un consumidor necesita para utilizar un módulo;
6. localiza los cambios;
7. expresa claramente el dominio;
8. evita abstracciones prematuras;
9. mantiene las dependencias dirigidas hacia conceptos estables;
10. permite comprender una funcionalidad sin recorrer innecesariamente todo el proyecto.

La arquitectura debe optimizar la capacidad de comprender y modificar el sistema, no la cantidad de patrones aplicados.

SOLID, GRASP, MVC, Clean Architecture, Hexagonal Architecture, Package by Feature y Vertical Slice son herramientas. Ninguna debe aplicarse mecánicamente cuando aumente la complejidad en lugar de reducirla.
