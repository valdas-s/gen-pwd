var masterPassword;
var siteKey;
var generateButton;
var generatedPassword;
var passwordLengthSlider;
var passwordLengthInfo;

var minPwdLength = 4;
var maxPwdLength = 64;
var currPwdLength;

function sliderRangeToPasswordLength(sliderValue) {
	var val = Math.round(minPwdLength+(sliderValue*(maxPwdLength-minPwdLength)));
    return val;
}
//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load() {
	generateButton = document.getElementById("generateButton");
	generateButton.onclick = generatePassword;
	masterPassword = document.getElementById("masterPassword");
	siteKey = document.getElementById("siteKey");
	generatedPassword = document.getElementById("generatedPassword");
	passwordLengthInfo = document.getElementById("passwordLengthInfo");
	passwordLengthSlider = new AppleHorizontalSlider(
		document.getElementById("passwordLengthSlider"),
		passwordLengthChanged);

    passwordLengthSlider.setValue((8-minPwdLength)/(maxPwdLength-minPwdLength));


	document.getElementById("masterPasswordText").innerText = getLocalizedString("Master Password:");
	document.getElementById("siteKeyText").innerText = getLocalizedString("Site Key:");
	document.getElementById("passwordLengthText").innerText = getLocalizedString("Password Length:");
	document.getElementById("generateButton").value = getLocalizedString("Generate!");
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove() {
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide() {
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show() {
    // Restart any timers that were stopped on hide
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync() {
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}

function generatePassword(event) {
	var combindedKey = siteKey.value + ":" + masterPassword.value + "\n";
	if (window.widget) {
		var cmd = widget.system("openssl dgst -rmd160 | openssl enc -base64", passwordGenerated);
		cmd.write(combindedKey);
		cmd.close();
		masterPassword.value = "";
	}
	else {
	    var v = ":"+siteKey.value;
	    while (v.length < currPwdLength) {
	      v = v + v;
	    }
		generatedPassword.value = v.substr(0, currPwdLength);
	}
}

function passwordGenerated(cmd) {
   generatedPassword.value = cmd.outputString.substr(0, currPwdLength);
}

function passwordLengthChanged(currentValue) {
	currPwdLength = sliderRangeToPasswordLength(currentValue);
	passwordLengthInfo.innerText = currPwdLength;
}

function getLocalizedString(string) {
    try { string = localizedStrings[string] || string; } catch (e) {}
    return string;
}
