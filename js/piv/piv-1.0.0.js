/*

   Validador PIV 1.0.0 - 12/12/2017

   PIV es un validador de formularios en el que con pequeñas reglas, puede tenerse completo control del
   flujo sobre los envíos de dichos formularios.

   Está diseñado para funcionar cuando se encuentra un único formulario en pantalla por lo que podría dar
   problemas si se aplica en una aplicación que no está diseñada de este modo.
   
   Piv contiene las directivas editables por el usuario para adaptarlo al diseño de formularios
   del que dispone, para habilitar o deshabilitar los envíos de los formularios según necesite el usuario.
   
   También contiene la clase que valida cada campo en el momento que pierde el foco, dándole una mayor
   flexibilidad y experiencia de usuario.
   
   La aplicación PIV en su versión 1.0.0 es estable y permite su uso únicamente con jQuery 3.2.1!!      
   
*/

//Variables globales que guardan el número de validaciones correctas
var correctValidations;
var formName;
var validationsRequired;

/***** FUNCIONES *****/

//Para el formulario actual, inicializamos el objeto del formulario y obtenemos los valores pertinentes
function initValidation(idForm){
                
    //Inicializamos la variable global de validaciones correctas
    correctValidations = 0;
    formName = idForm;

    //Cambiamos la visualización del formulario en cuestión
    $('#'+idForm).toggle();                
                
    //Si accedemos a dicho formulario cuando se está visualizando                
    if($('#'+idForm).css('display') == 'block'){
                    
        //Recogemos la cantidad de campos validables
        var ValidationsObjective = 0;

        $('#'+idForm).find('input').each(function(){
            if($(this).attr('data-status')){
                ValidationsObjective++;
            }
        });

        //Guardamos la cantidad de inputs que tiene el formulario para validar
        validationsRequired = ValidationsObjective;
        
    }
                
    //Si no, vaciamos el formulario y reseteamos los data-status en "no", deshabilitamos el botón y reseteamos los campos de error || SIN TESTEAR
    else{
        $('#'+idForm+' input[type=text]').val('');
        $('#'+idForm+' input[data-status]').attr('data-status', 'no');
        $('#'+idForm+'Button').prop('disabled', true);
        $('[id$=Error]').empty();
    }

}

/***** EVENTOS *****/
            
//Evento que captura el cambio de foco de cada input para evaluar el estado del formulario
$('input[type=text]').focusout(function(){
    
    //Creamos el objeto de validación
	field = new Piv($(this).val(), $(this).attr('data-required'), $(this).attr('data-type'));

    var mensajeError = '';
    mensajeError = field.validation();
    
    //Validamos el campo y pintamos el error si lo hay
    $(this).siblings('#'+$(this).attr('name')+'Error').html(mensajeError);
    
    //Si la validación es correcta, cambiamos el estado del data-status a 'yes' de este elemento
    if(mensajeError == ''){
        if($(this).attr('data-status')){
            $(this).attr('data-status', 'yes');
        }
    }
    //Si no, lo cambiamos a 'no'
    else{
        if($(this).attr('data-status')){
            $(this).attr('data-status', 'no');
        }
    }        
    
    //Contamos el número de data-status con valor 'yes' y lo igualamos a correctValidations
    correctValidations = $('[data-status=yes]').length;
    
    //Si tenemos todos los campos requeridos, validados, habilitamos el botón del formulario
    if(validationsRequired == correctValidations){
        $('#'+formName+'Button').prop('disabled', false);
    }
    else{
        $('#'+formName+'Button').prop('disabled', true);
    }
                
});

//Evento que controla el comportamiento de los elementos relacionados según la introducción de carácteres en cada uno de los input
$('input').keydown(function(){
    $(this).siblings('#'+$(this).attr('name')+'Error').empty();
    $(this).removeClass('inputError');
});

//******************** PIV CLASS ********************//

//Definimos el constructor del objeto CampoForm (Propiedades)
function Piv(value, valueRequired, type){
	this.value         = value;
    this.valueRequired = valueRequired;
    this.type          = type;
}

//Definimos el método validation(Requerido y tipo)
Piv.prototype.validation = function(){
    
    //Creamos la variable de mensaje de ámbito local
    var mensaje = '';
    
    //Validación de tipo valueRequired
	if((this.valueRequired) && (this.value == '')){
		mensaje = 'Este campo es obligatorio';
	}
    else{
        //Validación tipo DNI
        if(this.type == 'DNI'){
            
            if(!/^\d{8}[a-zA-Z]$/.test(this.value)){
                mensaje = 'El formato del DNI/NIF no es correcto';
            }
        
        }        
        
        //Validación tipo EMAIL
        else if(this.type == 'email'){

            if(!/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(this.value)){
                mensaje = 'No es una dirección de correo electrónico válida';
            }          
            
        }
    }
        
    return mensaje;
};

//********************             ********************//