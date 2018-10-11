let generateEquations = (function() {

function setEquation(equation, id) {
	let equationElement = document.getElementById(id);
	// equationElement.className = "equation element"
	equationElement.innerHTML = equation;
}

// let equation;

// equation =
// 	equ.elem(equ.text("cos")+ equ.sup("2","qwerty") + equ.text("&theta;") + equ.sub("n")) + 
//     equ.elem(equ.text("=")) + 
//     equ.frac(equ.elem(equ.text("x") + equ.sup("2")),"Basdfasdfasd") + 
//     equ.elem(equ.text("=")) + 
//     equ.sqrt(equ.elem(equ.text("x") + equ.sup("2") + equ.text("+1")))
// setEquation(equation, "test_equation");

// equation =
//             equ.elem(equ.text("arc length","a1")+
//             equ.elem(equ.text("=")) +
//             equ.elem(equ.text("angle","a5"))+
//             equ.frac(equ.elem(equ.text("x")+equ.sup("radius")+equ.text("+c")),
//                       equ.sqrt(equ.elem(equ.text("y")+equ.sup("2")+equ.text("+B"),"a10"),"a11"))

// setEquation(equation, "side_equation");


// equation =
// 	equ.elem(equ.text("cos","a1")+equ.sup("2","a2")+ equ.text("&theta;","a3") + equ.sub("n","a4")) +
// 	equ.elem(equ.text("=")) +
// 	equ.elem(equ.text("A","a5"))+
// 	equ.frac(equ.elem(equ.text("x")+equ.sup("2")+equ.text("+c")),
// 			 equ.sqrt(equ.elem(equ.text("y")+equ.sup("2")+equ.text("+B"),"a10"),"a11"))

// setEquation(equation, "side_equation");



})();