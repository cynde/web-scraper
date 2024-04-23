module.exports =  class Page {
    constructor(page) {
      this.url = page.url;
      this.title = page.title;
      this.content = ( page.content ) ? page.content : null;
      this.status = ( page.status ) ? page.status : 'finished';
      this.error = ( page.error ) ? page.error : null;    
    }
  }