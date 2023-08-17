export default function upOptions(appendDiv, values, opt){
	if (typeof values["display"] !== 'undefined') {
		var optv
		createselectoptions(opt, )
	}
	return;
}

function createselectoptions(opt, optval, opttext){
	const select = $(`<select id="option`+opt+`"></select>`);
	$('#option'+opt).append($('<option>', {
              value: optval,
              text: opttext
            }));
}

export default function removeselectoptions(opt) {
	$('#option'+opt).remove();
}