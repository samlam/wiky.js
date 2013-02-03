/**
 * Wiky.js - Javascript library to converts Wiki MarkUp language to HTML.
 * You can do whatever with it. Please give me some credits (Apache License)
 * - Tanin Na Nakorn 
 */

var wiky = {
    options: {
        'link-image': true, //Preserve backward compat
        excerptMode : false
    }
}


wiky.process = function (wikitext, options) {
    options = $.extend({}, wiky.options, options);

    var lines = wikitext.split(/\r?\n/);
    var html = "";

    var syntaxPrefix = '<script type="syntaxhighlighter" class="brush: %BRUSH%"><![CDATA[\r\n';
    var syntaxSuffix = '\r\n]]></script>';
    var syntaxCapturingBlock = false;
    var syntaxLanguage = "js";
    var syntaxBlock = [];

    for (i = 0; i < lines.length; i++) {
        line = lines[i];

        ///let's detect & process syntax highlighter
        if (line.match(/^\@\@/) != null) {
            if (!syntaxCapturingBlock) {
                //lets begin capture the code block
                syntaxLanguage = $.trim(line.substring(2, line.length) ) || syntaxLanguage;
                syntaxCapturingBlock = true;
            } else {
                //lets end capture and split out the syntaxHightlighter CDATA tag
                var codeBlock = syntaxPrefix.replace("%BRUSH%", syntaxLanguage);
                codeBlock += syntaxBlock.join('\r\n');
                codeBlock += syntaxSuffix;
                if (options.excerptMode) {
                    html += '<span style="color:#888;">code snippets</span>';
                } else {
                    html += codeBlock;
                }
                syntaxBlock = [];
                syntaxCapturingBlock = false;
            }
        }
        else if (syntaxCapturingBlock) {
            syntaxBlock.push(line);
        }
        else if (line.match(/^===/) != null && line.match(/===$/) != null) {
            html += "<h2>" + line.substring(3, line.length - 3) + "</h2>";
        }
        else if (line.match(/^==/) != null && line.match(/==$/) != null) {
            html += "<h3>" + line.substring(2, line.length - 2) + "</h3>";
        }
        else if (line.match(/^:+/) != null) {
            // find start line and ending line
            start = i;
            while (i < lines.length && lines[i].match(/^\:+/) != null) i++;
            i--;

            html += wiky.process_indent(lines, start, i);
        }
        else if (line.match(/^----+(\s*)$/) != null) {
            html += "<hr/>";
        }
        else if (line.match(/^(\*+) /) != null) {
            // find start line and ending line
            start = i;
            while (i < lines.length && lines[i].match(/^(\*+|\#\#+)\:? /) != null) i++;
            i--;

            html += wiky.process_bullet_point(lines, start, i);
        }
        else if (line.match(/^(\#+) /) != null) {
            // find start line and ending line
            start = i;
            while (i < lines.length && lines[i].match(/^(\#+|\*\*+)\:? /) != null) i++;
            i--;

            html += wiky.process_bullet_point(lines, start, i);
        }
        else if (line.length == 0) {
            html += "<br/>\n";
        }
        else {
            html += wiky.process_normal(line + "<br/>\n", options.excerptMode);
        }
    }

    return html;
}

wiky.process_indent = function(lines,start,end) {
    var i = start;
	
	var html = "<dl>";
	
	for(var i=start;i<=end;i++) {
		
		html += "<dd>";
		
		var this_count = lines[i].match(/^(\:+)/)[1].length;
		
		html += wiky.process_normal(lines[i].substring(this_count));
		
		var nested_end = i;
		for (var j=i+1;j<=end;j++) {
			var nested_count = lines[j].match(/^(\:+)/)[1].length;
			if (nested_count <= this_count) break;
			else nested_end = j;
		}
		
		if (nested_end > i) {
			html += wiky.process_indent(lines,i+1,nested_end);
			i = nested_end;
		}
		
		html += "</dd>";
	}
	
	html += "</dl>";
	return html;
}

wiky.process_bullet_point = function(lines,start,end) {
	var i = start;
	
	var html = (lines[start].charAt(0)=='*')?"<ul>":"<ol>";

    html += '\n';
	
	for(var i=start;i<=end;i++) {
		
		html += "<li>";
		
		var this_count = lines[i].match(/^(\*+|\#+) /)[1].length;
		
		html += wiky.process_normal(lines[i].substring(this_count+1));
		
		// continue previous with #:
		{
			var nested_end = i;
			for (var j = i + 1; j <= end; j++) {
				var nested_count = lines[j].match(/^(\*+|\#+)\:? /)[1].length;
				
				if (nested_count < this_count) 
					break;
				else {
					if (lines[j].charAt(nested_count) == ':') {
						html += "<br/>" + wiky.process_normal(lines[j].substring(nested_count + 2));
						nested_end = j;
					} else {
						break;
					}
				}
					
			}
			
			i = nested_end;
		}
		
		// nested bullet point
		{
			var nested_end = i;
			for (var j = i + 1; j <= end; j++) {
				var nested_count = lines[j].match(/^(\*+|\#+)\:? /)[1].length;
				if (nested_count <= this_count) 
					break;
				else 
					nested_end = j;
			}
			
			if (nested_end > i) {
				html += wiky.process_bullet_point(lines, i + 1, nested_end);
				i = nested_end;
			}
		}
		
		// continue previous with #:
		{
			var nested_end = i;
			for (var j = i + 1; j <= end; j++) {
				var nested_count = lines[j].match(/^(\*+|\#+)\:? /)[1].length;
				
				if (nested_count < this_count) 
					break;
				else {
					if (lines[j].charAt(nested_count) == ':') {
						html += wiky.process_normal(lines[j].substring(nested_count + 2));
						nested_end = j;
					} else {
						break;
					}
				}
					
			}
			
			i = nested_end;
		}
		
		html += "</li>\n";
	}
	
	html += (lines[start].charAt(0)=='*')?"</ul>":"</ol>";
    html += '\n';
	return html;
}

wiky.process_url = function(txt) {
	
	var index = txt.indexOf(" "),
        url = txt,
        label = txt,
        css = '';
	
	if (index !== -1) {
		url = txt.substring(0, index);
		label = txt.substring(index + 1);
	}
	return '<a href="' + url + '"' + (wiky.options['link-image'] ? css : '') + ' target="_blank">' + label + '</a>';
};

wiky.process_image = function(txt) {
	var index = txt.indexOf(" ");
	url = txt;
	label = "";
	
	if (index > -1) 
	{
		url = txt.substring(0,index);
		label = txt.substring(index+1);
	}
	
	
	return "<img src='"+url+"' alt=\""+label+"\" />";
}

wiky.process_video = function (url, excerptMode) {
    var id = '';
    if (url.match(/^(https?:\/\/)?(www.)?youtube.com\//) == null) {
        return "<b>" + url + " is an invalid YouTube URL</b>";
    }

    if ((result = url.match(/^(https?:\/\/)?(www.)?youtube.com\/watch\?(.*)v=([^&]+)/)) != null) {
        id = result[4];
        url = "http://www.youtube.com/embed/" + id; //append the id
    }

    if (excerptMode) {
        //return '<iframe width="220" height="75" src="' + url + '?wmode=transparent" frameborder="0" allowfullscreen></iframe>';
        return '<div class="lite" id="' + id + '" style="width:230px;height:200px;" data-playwidth="230" data-playheight="200" data-minimode="'+ excerptMode +'"></div>'
    } else {
        //return '<iframe width="480" height="390" src="' + url + ' " frameborder="0" allowfullscreen></iframe>';
        return '<div class="lite" id="' + id + '" style="width:480px;height:390px;" data-playwidth="480" data-playheight="390" data-minimode="'+ excerptMode +'"></div>'
    }
}

wiky.process_normal = function(wikitext, excerptMode) {
	
	// Image
	{
		var index = wikitext.indexOf("[[File:");
		var end_index = wikitext.indexOf("]]", index + 7);
		while (index > -1 && end_index > -1) {
			
			wikitext = wikitext.substring(0,index) 
						+ wiky.process_image(wikitext.substring(index+7,end_index)) 
						+ wikitext.substring(end_index+2);
		
			index = wikitext.indexOf("[[File:");
			end_index = wikitext.indexOf("]]", index + 7);
		}
	}
	
	// Video
	{
		var index = wikitext.indexOf("[[Video:");
		var end_index = wikitext.indexOf("]]", index + 8);
		while (index > -1 && end_index > -1) {
			
			wikitext = wikitext.substring(0,index) 
						+ wiky.process_video(wikitext.substring(index+8,end_index), excerptMode) 
						+ wikitext.substring(end_index+2);
		
			index = wikitext.indexOf("[[Video:");
			end_index = wikitext.indexOf("]]", index + 8);
		}
	}
	
	
	// URL
	var protocols = ["http","ftp","news"];
	
	for (var i=0;i<protocols.length;i++)
	{
		var index = wikitext.indexOf("["+protocols[i]+"://");
		var end_index = wikitext.indexOf("]", index + 1);
		while (index > -1 && end_index > -1) {
		
			wikitext = wikitext.substring(0,index) 
						+ wiky.process_url(wikitext.substring(index+1,end_index)) 
						+ wikitext.substring(end_index+1);
		
			index = wikitext.indexOf("["+protocols[i]+"://",end_index+1);
			end_index = wikitext.indexOf("]", index + 1);
			
		}
	}
	
	var count_b = 0;
	var index = wikitext.indexOf("'''");
	while(index > -1) {
		
		if ((count_b%2)==0) wikitext = wikitext.replace(/'''/,"<b>");
		else wikitext = wikitext.replace(/'''/,"</b>");
		
		count_b++;
		
		index = wikitext.indexOf("'''",index);
	}
	
	var count_i = 0;
	var index = wikitext.indexOf("''");
	while(index > -1) {
		
		if ((count_i%2)==0) wikitext = wikitext.replace(/''/,"<i>");
		else wikitext = wikitext.replace(/''/,"</i>");
		
		count_i++;
		
		index = wikitext.indexOf("''",index);
	}
	
	wikitext = wikitext.replace(/<\/b><\/i>/g,"</i></b>");
	
	return wikitext;
}

if (typeof exports === 'object') {
    for (var i in wiky) {
        exports[i] = wiky[i];
    }
}