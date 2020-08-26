// Book Class: Represents a Book
class Book 
{
    constructor(title, author, isbn) 
    {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI
{
    static displayBooks()
    {
        // reach into local storage a get our books
        const books = Store.getBooks();

        // loop through books in array call add book
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book)
    {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el)
    {
        if (el.classList.contains('delete'))
        {
            // Removing the parente element, rather than just the button
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className)
    {
        // Create a new div for the alert
        const div = document.createElement('div');
        // Adding classes to the new div
        // Can be alert-danger, alert-success, etc
        div.className = `alert ${className}`;
        // Add the message to the new passed in as text
        div.appendChild(document.createTextNode(message));
        // Find the container everything is in
        const container = document.querySelector('.container');
        // Find the form alert will be above
        const form = document.querySelector('#book-form');
        // Insert alert before the form
        container.insertBefore(div, form);
        // Vanish in 3 seconds(3000ms)
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields()
    {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Local Storage

// Objects can't be saved to local storage
// To store, we have to stringify it
// To pull it out, we have to parse it
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null)
        {
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book)
    {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn)
    {
        const books = Store.getBooks();
        
        books.forEach((book, index) =>
        {
            if(book.isbn === isbn)
            {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }


}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks());


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => 
{
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validation
    if(title === '' || author == '' || isbn === '')
    {
        UI.showAlert('Please fill in all fields.', 'alert-danger');
    }
    else
    {
        // Instantiate book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to Store
        Store.addBook(book);

        // Success alert
        UI.showAlert('Book successfully added.', 'alert-success');

        // Clear fields
        UI.clearFields();
    }   

});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => 
{
    // Remove book from UI using ISBN
    UI.deleteBook(e.target);

    // Remove book from Store
    // Finding the ISBN and passing to remove book
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Delete book alert
    UI.showAlert('Book removed.', 'alert-info');
});