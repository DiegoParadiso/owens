import re

file_path = "/Users/diego/Documents/builds/owens-system/docs/1_Planificacion/1.5.5_calificacion_casos_de_uso.md"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_table = False

def get_rabv(calificacion):
    c = calificacion.strip().lower()
    if c == "crítico":
        return " 3 ", " 3 ", " 3 "  # Alta complejidad, Alta Arq, Alto Valor (Puntaje 9)
    elif c == "alto":
        return " 2 ", " 2 ", " 3 "  # Medio riesgo, media arq, alto valor (Puntaje 7)
    elif c == "medio":
        return " 1 ", " 1 ", " 2 "  # Bajo riesgo, baja arq, valor medio (Puntaje 4)
    elif c == "bajo":
        return " 1 ", " 1 ", " 1 "  # Todo bajo (Puntaje 3)
    return " R ", " A ", " BV "

for line in lines:
    if line.startswith("| Caso de Uso | Calificación | Justificación Breve |"):
        new_lines.append("| Caso de Uso | R | A | BV | Calificación | Justificación Breve |\n")
        in_table = True
    elif line.startswith("| :--- | :--- | :--- |"):
        new_lines.append("| :--- | :--- | :--- | :--- | :--- | :--- |\n")
    elif in_table and line.startswith("| **UC-"):
        parts = line.split("|")
        # parts[0] is empty (before first |)
        # parts[1] is Caso de uso
        # parts[2] is Calificacion
        # parts[3] is Justificacion
        uc = parts[1]
        calif = parts[2]
        justif = parts[3]
        
        r, a, bv = get_rabv(calif)
        
        new_line = f"|{uc}|{r}|{a}|{bv}|{calif}|{justif}|\n"
        new_lines.append(new_line)
    elif in_table and not line.strip():
        in_table = False
        new_lines.append(line)
    else:
        new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Table formatted successfully.")
