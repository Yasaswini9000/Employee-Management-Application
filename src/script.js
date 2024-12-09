document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const navMenu = document.getElementById("nav-menu");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const searchBar = document.getElementById("search-bar");

  // State
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  let currentPage = 1;

  // Render Header Navigation
  hamburgerMenu.addEventListener("click", () => {
    navMenu.style.display = navMenu.style.display === "block" ? "none" : "block";
  });

  document.getElementById("register-link").addEventListener("click", () => renderRegistrationPage());
  document.getElementById("list-link").addEventListener("click", () => renderEmployeeList());

  searchBar.addEventListener("input", () => searchEmployee(searchBar.value));

  // Pages
  function renderRegistrationPage() {
    content.innerHTML = `
      <h2>Employee Registration</h2>
      <form id="employee-form">
        <input type="text" name="name" placeholder="Name" required>
        <input type="text" name="position" placeholder="Position" required>
        <textarea name="about" placeholder="About" required></textarea>
        <input type="date" name="joining_date" required>
        <button type="submit">Register</button>
      </form>
    `;

    document.getElementById("employee-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newEmployee = Object.fromEntries(formData.entries());
      employees.push(newEmployee);
      localStorage.setItem("employees", JSON.stringify(employees));
      renderEmployeeList();
    });
  }

  function renderEmployeeList() {
    const start = (currentPage - 1) * 5;
    const paginatedEmployees = employees.slice(start, start + 5);

    content.innerHTML = `
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>About</th>
            <th>Joining Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${paginatedEmployees.map((e, i) => `
            <tr>
              <td>${e.name}</td>
              <td>${e.position}</td>
              <td>${e.about}</td>
              <td>${e.joining_date}</td>
              <td><button data-index="${start + i}" class="delete-btn">Delete</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="pagination">
        ${Array.from({ length: Math.ceil(employees.length / 5) }, (_, i) => `
          <button class="page-btn" data-page="${i + 1}">${i + 1}</button>
        `).join("")}
      </div>
    `;

    document.querySelectorAll(".delete-btn").forEach(btn => btn.addEventListener("click", deleteEmployee));
    document.querySelectorAll(".page-btn").forEach(btn => btn.addEventListener("click", (e) => {
      currentPage = +e.target.dataset.page;
      renderEmployeeList();
    }));
  }

  function deleteEmployee(e) {
    const index = +e.target.dataset.index;
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    renderEmployeeList();
  }

  function searchEmployee(query) {
    const filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(query.toLowerCase()));
    employees = query ? filteredEmployees : JSON.parse(localStorage.getItem("employees"));
    renderEmployeeList();
  }

  // Initial Render
  renderRegistrationPage();
});
