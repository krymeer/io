var template = ' \
  <!DOCTYPE html> \n \
    <html lang="pl"> \n \
      <head> \n \
        <meta charset="utf-8"> \n \
        <meta name="viewport" content="width=device-width,initial-scale=1.0">\n\
        <title>Wygenerowany szablon</title> \n\
        <style>{{style}}</style> \n\
      </head> \n\
      <body> \n\
        <div id="main_container"> \n\
          <header> \n\
            {{header}} \n\
          </header> \n\
          <div id="main_content"> \n\
            {{main_content}} \n\
          </div> \n\
          <footer> \n\
            {{footer}} \n\
          </footer> \n\
        </div> \n\
      </body> \n\
    </html>';


function create_html_template(header, main_content, footer) {
  return  template.replace('{{header}}', header)
                  .replace('{{main_content}}', main_content)
                  .replace('{{footer}}', footer)
                  .replace('{{style}}', basic_css)
}