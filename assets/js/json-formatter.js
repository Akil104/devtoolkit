function formatJSON(){
    const input=document.getElementById("jsonInput").value;
    const output=document.getElementById("output");

    try{
        const parsed=JSON.parse(input);
        output.textContent=JSON.stringify(parsed,null,2);
        output.classList.remove("error");

    }
    catch (e) {
    output.textContent = "❌ Invalid JSON";
    output.classList.add("error");
  }
}
function minifyJSON(){
    const input=document.getElementById("jsonInput").value;
    const output=document.getElementById("output");

    try{
        const parsed=JSON.parse(input);
        output.textContent=JSON.stringify(parsed);
        output.classList.remove("error");
    }
    catch (e){
         output.textContent = "❌ Invalid JSON";
         output.classList.add("error");
    }
}
function clearJSON(){
    const input=document.getElementById("jsonInput").value="";
    const output=document.getElementById("output").textcontent="";
}
