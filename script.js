const estructura = {
    "1er Año": {
        "1er Cuatrimestre": [
            "Introduccion a la psicologia",
            "Psicologia social",
            "Introduccion a la informatica",
            "Fundamentos de sociologia y antropologia",
            "Lenguaje, Lógica y Argumentación"
        ],
        "2do Cuatrimestre": [
            "Biologia y neurofiosolgia",
            "Escuelas en pisoclogia",
            "Filosofia",
            "Historia de la civilizacion",
            "Introduccion a la empresa"
        ]
    },
    "2do Año": {
        "1er Cuatrimestre": [
            "Fundamentos de psicologia cognitiva",
            "Psicoanálisis I",
            "Psicologia del desarrollo I",
            "Introduccion a la estadistica",
            "Artes combinadas"
        ],
        "2do Cuatrimestre": [
            "Psicopatologia",
            "Psicologia de los vinculos laborales",
            "Metodologia de la investigacion psicologia",
            "Ingles I"
        ]
    },
    "3er Año": {
        "1er Cuatrimestre": [
            "Fundamentos de psicologia sistemica",
            "Ingles II",
            "Psicologia del desarrollo II",
            "Psicologia institucional",
            "Psicoanalisis II"
        ],
        "2do Cuatrimestre": [
            "Psicologia del desarrollo III",
            "Gerencia de recursos humanos",
            "TTED: Tecnicas psicometricas",
            "Psicopatología actuales",
            "Evaluacion de os vinculos interpersonales"
        ]
    },
    "4to Año": {
        "1er Cuatrimestre": [
            "Psicologia y salud publica",
            "Psicologia clinica",
            "Psicoanálisis: escuela inglesa y francesa",
            "TTED: tecnicas proyectivas",
            "Psico. Educacional y orientcion vocacional"
        ],
        "2do Cuatrimestre": [
            "Teoria y tecnica de seleccion de personal",
            "Diseños de investigacion",
            "Metodos psicoterapeuticos",
            "Psicologia juridica",
            "Etica y deontologia",
            "Psicofarmacologia para psicologos"
        ]
    },
    "Finales": {
        "Integración": [
            "PPS - Practicas profesionales supervisadas",
            "TIF - Trabajo integrador final"
        ]
    }
};

const requisitos = {
    "Psicoanálisis I": ["Introduccion a la psicologia"],
    "Psicologia del desarrollo I": ["Introduccion a la psicologia"],
    "Psicopatologia": ["Introduccion a la psicologia", "Biologia y neurofiosolgia"],
    "Psicologia de los vinculos laborales": ["Introduccion a la psicologia"],
    "Metodologia de la investigacion psicologia": ["Introduccion a la psicologia", "Introduccion a la estadistica"],
    "Ingles II": ["Ingles I"],
    "Psicologia del desarrollo II": ["Psicologia del desarrollo I"],
    "Psicologia institucional": ["Psicologia social"],
    "Psicoanalisis II": ["Psicoanálisis I"],
    "Psicologia del desarrollo III": ["Psicologia del desarrollo I"],
    "TTED: Tecnicas psicometricas": ["Metodologia de la investigacion psicologia"],
    "Psicopatología actuales": ["Fundamentos de psicologia cognitiva", "Psicoanálisis I", "Psicopatologia"],
    "Psicologia y salud publica": ["Psicologia social", "Metodologia de la investigacion psicologia"],
    "Psicologia clinica": ["Psicopatologia", "Psicoanalisis II", "Psicologia del desarrollo II"],
    "Psicoanálisis: escuela inglesa y francesa": ["Psicoanálisis I"],
    "TTED: tecnicas proyectivas": ["Psicopatologia", "Psicoanalisis II"],
    "Psico. Educacional y orientcion vocacional": ["Psicologia del desarrollo II"],
    "Teoria y tecnica de seleccion de personal": ["Gerencia de recursos humanos", "TTED: Tecnicas psicometricas"],
    "Diseños de investigacion": ["Metodologia de la investigacion psicologia", "TTED: Tecnicas psicometricas"],
    "Metodos psicoterapeuticos": ["Fundamentos de psicologia cognitiva", "Psicopatologia", "Psicologia del desarrollo II", "Psicoanalisis II"],
    "Psicologia juridica": ["Psicologia institucional"],
    "Etica y deontologia": ["Filosofia"],
    "Psicofarmacologia para psicologos": ["Psicopatología actuales"],
    "PPS - Practicas profesionales supervisadas": ["30_materias"],
    "TIF - Trabajo integrador final": ["Diseños de investigacion"]
};

const estado = {};

function crearMalla() {
    const malla = document.getElementById('malla');
    for (const anio in estructura) {
        const divAnio = document.createElement('div');
        divAnio.className = 'anio';
        const tituloAnio = document.createElement('h2');
        tituloAnio.textContent = anio;
        divAnio.appendChild(tituloAnio);

        for (const cuatr in estructura[anio]) {
            const divCuatr = document.createElement('div');
            divCuatr.className = 'cuatrimestre';
            const tituloCuatr = document.createElement('h3');
            tituloCuatr.textContent = cuatr;
            divCuatr.appendChild(tituloCuatr);

            for (const materia of estructura[anio][cuatr]) {
                const divMateria = document.createElement('div');
                divMateria.className = 'materia';
                divMateria.dataset.nombre = materia;
                divMateria.textContent = materia;

                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = 'Nota';
                input.min = 1;
                input.max = 10;
                input.addEventListener('change', () => {
                    estado[materia].nota = parseFloat(input.value);
                    calcularPromedio();
                });

                divMateria.appendChild(input);
                divMateria.addEventListener('click', () => aprobarMateria(materia, divMateria));
                divCuatr.appendChild(divMateria);
                estado[materia] = {
                    nombre: materia,
                    div: divMateria,
                    requisitos: requisitos[materia] || [],
                    aprobada: false,
                    nota: null
                };
            }

            divAnio.appendChild(divCuatr);
        }

        malla.appendChild(divAnio);
    }
}

function aprobarMateria(nombre, div) {
    const materia = estado[nombre];
    if (materia.requisitos.some(req => req !== \"30_materias\" && !estado[req]?.aprobada)) {
        alert(\"Aún no cumple los requisitos para aprobar esta materia.\");
        return;
    }
    materia.aprobada = true;
    div.classList.add('aprobada');
    desbloquearMaterias();
    calcularPromedio();
}

function desbloquearMaterias() {
    const aprobadas = Object.values(estado).filter(m => m.aprobada).length;
    for (const materia of Object.values(estado)) {
        if (!materia.aprobada && materia.requisitos.every(r => r === \"30_materias\" ? aprobadas >= 30 : estado[r]?.aprobada)) {
            materia.div.classList.remove('bloqueada');
        }
    }
}

function calcularPromedio() {
    let suma = 0;
    let cantidad = 0;
    const primerAnio = Object.keys(estructura[\"1er Año\"]).flatMap(c => estructura[\"1er Año\"][c]);
    for (const nombre of primerAnio) {
        const mat = estado[nombre];
        if (mat.aprobada && mat.nota) {
            suma += mat.nota;
            cantidad++;
        }
    }
    document.getElementById('promedio').textContent = cantidad ? (suma / cantidad).toFixed(2) : '-';
}

crearMalla();
