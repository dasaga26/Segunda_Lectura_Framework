<?php
if(isset($_GET['module'])){
	switch($_GET['module']){
		case "home";
			include("module/".$_GET['module']."/controller/controller_".$_GET['module'].".php");
			break;
		case "cars";
			include("module/".$_GET['module']."/controller/controller_".$_GET['module'].".php");
			break;
		case "shop";
			include("module/".$_GET['module']."/controller/controller_".$_GET['module'].".php");
			break;
		case "login";
			include("module/".$_GET['module']."/controller/controller_".$_GET['module'].".php");
			break;
		case "errors";
			include("module/".$_GET['module']."/controller/controller_".$_GET['module'].".php");
			break;
		case "aboutus";
			include("module/".$_GET['module']."/".$_GET['module'].".php");
			break;
		case "contact";
			include("module/".$_GET['module']."/".$_GET['module']."_us".".php");
			break;
		default;
		include("module/".$_GET['module']."/controller/controller_".$_GET['module'].".php");
			break;
	}

} else {
	include("module/home/view/home.html");
}

?>