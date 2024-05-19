document.getElementById('drawerToggle').addEventListener('click', function() {
    var drawer = document.getElementById('drawer');
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
    } else {
        drawer.classList.add('open');
    }
});

function toggleDetails(id) {
    var details = document.getElementById(id);
    if (details.style.display === "none") {
        details.style.display = "block";
    } else {
        details.style.display = "none";
    }
}

// Close the drawer when clicking on a link
document.querySelectorAll('#drawer a').forEach(function(link) {
    link.addEventListener('click', function() {
        var drawer = document.getElementById('drawer');
        drawer.classList.remove('open');
    });
});
