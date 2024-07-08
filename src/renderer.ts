let elements: {
    calculatorDiv: HTMLDivElement,
    radioButton: HTMLButtonElement,
    text: HTMLTextAreaElement
};

interface StringWrapper {
    value: string;
}

interface NumberWrapper {
    value: number;
}

function IsDigit(char: string) {
    return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;
}

function ExtractNumber(graph: string, i: NumberWrapper) {
    let num: string = "";

    while (!IsDigit(graph.charAt(i.value))) {
        ++i.value;
    }

    while (i.value < graph.length && IsDigit(graph.charAt(i.value))) {
        num = num += graph.at(i.value);
        ++i.value;
    }
    return Number(num);
}



function TupleDefine(graph: string, i: NumberWrapper) {
    /*számhármasokat létrehozni
                1 megkeresünk egy számot
                    Ha legelől vagyunk akkor egyből megvan, ha nincs ott szám, akkor 1
                2. aztán megnézzük hogy van-e x
                    Ha van utána ^ akkor az a kitveő
                    Ha nincs akkor 1
                    Különben 0
                3. van - e y
                    Ha van utána ^ akkor az a kitveő
                    Ha nincs akkor 1
                    Különben 0
                */

    let nums: [number, number, number] = [1, 0, 0];
    let neg: boolean;
    neg = false;
    //Az együtthatő negálásához
    if(graph.at(i.value) == '-'){
        neg = true;
    }
    //Előjel átugrás
    if(graph.at(i.value) === '+' || graph.at(i.value) === '-'){
        ++i.value;
    }

    //1. lépés -> i.indexen mi van?
    if (IsDigit(graph.charAt(i.value))) {
        nums[0] = ExtractNumber(graph, i);
    }
    //Ha negatív előjel volt akkor negáljuk
    if(neg) nums[0] *= -1;

    //keresünk x-et vagy y-t ha nincs akkor maradhat 0 a nums - ban
    if (graph.at(i.value) === 'x') {
        //megnézni, hogy van-e utána kitevő
        if (graph.at(i.value + 1) === '^') {

            //elmentjök az indexet későbbi használatra
            let tmp: number = i.value+1;
            nums[1] = ExtractNumber(graph, i);
            //ha a hatványjel után negatív van, akkor negálunk
            if(graph.at(tmp+1) == '-') nums[1] *= -1;
        }
        //különben 1
        else {
            nums[1] = 1;
            ++i.value;
        }
    }
    if (graph.at(i.value) === 'y') {
        //megnézni, hogy van-e utána kitevő
        if (graph.at(i.value + 1) === '^') {
            //hasonlóan az x esetén
            let tmp: number = i.value+1;
            nums[2] = ExtractNumber(graph, i);
            if(graph.at(tmp+1) == '-') nums[2] *= -1;
        }
        //különben 1
        else {
            nums[2] = 1;
            ++i.value;
        }
    }
    console.log(nums);
    return nums;
}


window.addEventListener('load', () => {
    elements = {
        calculatorDiv: document.getElementById('calculator') as HTMLDivElement,
        radioButton: document.getElementById('radio') as HTMLButtonElement,
        text: document.getElementById('unique') as HTMLTextAreaElement
    };

    let calculator = Desmos.GraphingCalculator(elements.calculatorDiv);

    elements.text.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            calculator.setBlank();
            calculator.setExpression({ id: 'mappa', type: 'folder', text: 'Saját' });
            calculator.setExpression({ id: 'graph', latex: elements.text.value, color: '#c74440' })

            //3x^2y + 2xy^2 + 4x + 5y + 6
            let graph = elements.text.value;
            let coefficient_num = 1;
            //a 2. karakter az vagy szám lesz vagy ^ ( mindig az első tagon belül leszünk)
            for (let i = 1; i < graph.length; i++) {
                if (graph.at(i) === '+') {
                    ++coefficient_num;
                }
                //akkor kell számolni a -, ha ne nem kitevőben van
                if (i != 0 && graph.at(i - 1) != '^' && graph.at(i) === '-') {
                    ++coefficient_num;
                }
            }

            //coefficient egy tömb amiben tuple-ek vannak az együttható és a változó kitevőjét tartalmazza
            // tuple [ együttható, x kitevő, y kitevő]
            let coefficients: [number, number, number][] = new Array(coefficient_num);
            console.clear();
            let j = 0;
            let i: NumberWrapper = { value: 0 };
            for (i.value = 0; i.value < graph.length; ++i.value) {
                if (i.value === 0 && graph.at(0) != '-') {
                    coefficients[0] = TupleDefine(graph, i);
                    ++j;
                }
                else if (graph.at(0) == '-') {
                    coefficients[0] = TupleDefine(graph, i);
                    ++j;
                }
                else if (i.value < graph.length && (graph.at(i.value) === '+' || graph.at(i.value) === '-')) {
                    coefficients[j] = TupleDefine(graph, i);
                    ++j;
                }
                else{
                    ++i.value;
                }
            }

        }
    })

    document.querySelectorAll('input[name="function"]').forEach((radio) => {
        radio.addEventListener('change', (event) => {
            const value = (event.target as HTMLInputElement).value;

            switch (value) {
                case 'graph1':
                    calculator.setBlank();
                    calculator.setExpression({ id: 'mappa', type: 'folder', text: 'Descartes - féle levél' });


                    calculator.setExpression({ id: 'graph', latex: 'x^3+y^3-3Cxy=0', color: '#c74440' });
                    calculator.setExpression({ id: 'note', type: 'text', text: 'A C egy konstans' });
                    calculator.setExpression({ id: 'const', latex: 'C=1' });

                    calculator.setExpression({ id: 'Folderpole', type: 'folder', text: 'A pólus' });
                    calculator.setExpression({ id: 'pole', latex: '(a,b)', color: 'black' });
                    calculator.setExpression({ id: 'a', latex: 'a=1' });
                    calculator.setExpression({ id: 'fnote', type: 'text', text: 'Azok a pontok, mikor a másodrendű görbe parabola lesz erre a görbére esnek:' });
                    calculator.setExpression({ id: 'functionf', latex: 'f(x)=(C^2)/(4*x)', color: '#2d70b3' });
                    calculator.setExpression({ id: 'b', latex: 'b=f(a)' });

                    calculator.setExpression({ id: 'cnote', type: 'text', text: 'A pólushoz tartozó poláris görbe' });
                    calculator.setExpression({ id: 'polarCurve', latex: 'ax^2-aCy+by^2-bCx-Cxy=0', color: '#388c46' })

                    calculator.setExpression({ id: 'pnote', type: 'text', text: 'A ponthoz tartozó poláris' });
                    calculator.setExpression({ id: 'polar', latex: '2a^2x-abC-aCy+2b^2y-abC-bCx-aCy-bCx=0', color: '#fa7e19' })
                    break;
                case 'graph2':
                    calculator.setBlank();
                    calculator.setExpression({ id: 'mappa', type: 'folder', text: 'Dioklész-féle cisszoid' });

                    calculator.setExpression({ id: 'graph', latex: 'x^3+x*y^2-Cy^2=0', color: '#c74440' });
                    calculator.setExpression({ id: 'note', type: 'text', text: 'A C egy konstans' });
                    calculator.setExpression({ id: 'const', latex: 'C=1', sliderBounds: { min: '0', max: '10' } })

                    calculator.setExpression({ id: 'Folderpole', type: 'folder', text: 'Pólus' });
                    calculator.setExpression({ id: 'pole', latex: '(a,b)', color: 'black' });
                    calculator.setExpression({ id: 'a', latex: 'a=1' })
                    calculator.setExpression({ id: 'fnote', type: 'text', text: 'Azok a pontok, mikor a másodrendű görbe parabola lesz erre a görbére esnek:' });
                    calculator.setExpression({ id: 'functionf', latex: 'f(x)=\\sqrt{3x(x-C)}', color: '#2d70b3' });
                    calculator.setExpression({ id: 'b', latex: 'b=f(a)' });

                    calculator.setExpression({ id: 'cnote', type: 'text', text: 'A pólushoz tartozó poláris görbe' });
                    calculator.setExpression({ id: 'polarCurve', latex: '3ax^2+ay^2+2bxy-2bCy-Cy^2=0', color: '#388c46' })

                    calculator.setExpression({ id: 'pnote', type: 'text', text: 'A ponthoz tartozó poláris' });
                    calculator.setExpression({ id: 'polar', latex: '3a^2x+2aby+b^2x-b^2C-2Cby=0', color: '#fa7e19' })
            }

        });
    });
});




