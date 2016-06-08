/** get file name */
function getFileName(full_name) {
	full_name = full_name.replace('\\', '/');
	var index = full_name.lastIndexOf("/");
	return index == -1 ? full_name : full_name.substring(index + 1, full_name.length);	
}
/** get file image */
function getFileImage(filename) {
	var type = filename.substring(filename.lastIndexOf(".") + 1).toUpperCase();
	var image = "unknow.gif";
	switch (type) {
		case "TXT":
			image = "txt.gif"
			break;
		case "CHM":
		case "HLP":
			image = "hlp.gif"
			break;
		case "DOC":
			image = "doc.gif"
			break;
		case "PDF":
			image = "pdf.gif"
			break;
		case "MDB":
			image = "mdb.gif"
			break;
		case "GIF":
		case "JPG":
		case "PNG":
		case "BMP":
			image = "pic.gif"
			break;
		case "ASP":
		case "JSP":
		case "JS":
		case "PHP":
		case "PHP3":
		case "ASPX":
			image = "code.gif"
			break;
		case "HTM":
		case "HTML":
		case "SHTML":
			image = "htm.gif"
			break;
		case "ZIP":
		case "RAR":
			image = "zip.gif"
			break;
		case "EXE":
			image = "exe.gif"
			break;
		case "AVI":
		case "MPG":
		case "MPEG":
		case "ASF":
			image = "mp.gif"
			break;
		case "RA":
		case "RM":
			image = "rm.gif"
			break;
		case "MID":
		case "WAV":
		case "MP3":
		case "MIDI":
			image = "audio.gif"
			break;
		case "XLS":
			image = "xls.gif"
			break;
		case "PPT":
		case "PPS":
			image = "ppt.gif"
			break;
	}
	return "<img border=\"0\" src=\"component/images/file/" + image + "\"/>";
}