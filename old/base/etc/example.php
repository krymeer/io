<?php
	$pwr = array(array("Wydział Podstawowych Problemów Techniki","w11"), array("Wydział Informatyki i Zarządzania","w8"));
	$uwr = array(array("Wydział Matematyki i Informatyki","xx"));
	$w11 = array(array("Informatyka","cs"), array("Inżynieria biomedyczna","ib"));
	$xxx = array(array("Informatyka","cs"), array("Matematyka","math"));
	$w8 = array(array("Informatyka","cs"), array("Zarządzanie","mn"));
	$cs = array(
		array("Architektura komputerów i systemy operacyjne", "dr inż. Marcin Zawada", "ĆWICZENIA", "P01-23a", "pn 7:30-9:00", "bud. C-7, sala 202", "dr inż. Przemysław Błaśkiewicz"),		
		array("Architektura komputerów i systemy operacyjne", "dr inż. Marcin Zawada", "ĆWICZENIA", "P01-23b", "pn 9:15-11:00", "bud. C-7, sala 202", "dr inż. Przemysław Błaśkiewicz"),		
		array("Architektura komputerów i systemy operacyjne", "dr inż. Marcin Zawada", "ĆWICZENIA", "P01-23c", "wt 13:15-15:00", "bud. C-7, sala 202", "dr inż. Przemysław Błaśkiewicz"),		
		array("Architektura komputerów i systemy operacyjne", "dr inż. Marcin Zawada", "ĆWICZENIA", "P01-23d", "cz 9:15-11:00", "bud. D-1, sala 312B", "dr inż. Przemysław Błaśkiewicz"),
		array("Algebra z geometrią analityczną", "prof. dr hab. Jacek Cichoń", "WYKŁAD", "P01-14a", "wt 9:15-11:00, śr 13:15-15:00", "bud. C-13, sala 1.27", "prof. dr hab. Jacek Cichoń"),
		array("Algebra z geometrią analityczną", "prof. dr hab. Jacek Cichoń", "ĆWICZENIA", "P01-13a", "wt 7:30-9:00", "bud. C-7, sala 202", "dr Krzysztof Majcher"),
		array("Algebra z geometrią analityczną", "prof. dr hab. Jacek Cichoń", "ĆWICZENIA", "P01-13b", "wt 17:05-18:45", "bud. C-7, sala 202", "mgr Krzysztof Grining"),
		array("Algebra z geometrią analityczną", "prof. dr hab. Jacek Cichoń", "ĆWICZENIA", "P01-13c", "wt 18:55-20:35", "bud. C-7, sala 202", "dr inż. Robert Rałowski"),
		array("Algebra z geometrią analityczną", "prof. dr hab. Jacek Cichoń", "ĆWICZENIA", "P01-13d", "śr 9:15-11:00", "bud. C-7, sala 202", "dr Przemysław Kubiak"),
		array("Algebra z geometrią analityczną", "prof. dr hab. Jacek Cichoń", "ĆWICZENIA", "P01-13e", "cz 13:15-15:00", "bud. C-7, sala 202", "dr Przemysław Kubiak")
	);
	$tmp = array(array("nazwa przedmiotu", "wykładowca", "typ", "kod", "godzina", "miejsce", "prowadzący"));
	if (isset($_GET["uni"]) && !empty($_GET["uni"]) && empty($_GET["fac"]) && empty($_GET["fld"])) {
		if ($_GET["uni"] === "pwr") {
			echo json_encode($pwr);			
		} else if ($_GET["uni"] === "uwr") {
			echo json_encode($uwr);
		}
		echo "";
	} else if (isset($_GET["fac"]) && !empty($_GET["fac"]) && isset($_GET["uni"]) && !empty($_GET["uni"]) && empty($_GET["fld"])) {
		if ($_GET["fac"] === "w11" && $_GET["uni"] === "pwr") {
			echo json_encode($w11);			
		} else if ($_GET["fac"] === "w8" && $_GET["uni"] === "pwr") {
			echo json_encode($w8);			
		} else if ($_GET["fac"] === "xx" && $_GET["uni"] === "uwr") {
			echo json_encode($xxx);			
		}
		echo "";
	} else if (isset($_GET["fac"]) && !empty($_GET["fac"]) && isset($_GET["uni"]) && !empty($_GET["uni"]) && isset($_GET["fld"]) && !empty($_GET["fld"])) {
		if ($_GET["fld"] === "cs" && $_GET["fac"] === "w11" && $_GET["uni"] === "pwr") {
			echo json_encode($cs);
		} else {
			echo json_encode($tmp);
		}
	}
?>