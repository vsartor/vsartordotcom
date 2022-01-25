function openNav() {
    navbar = document.getElementById("mySidebar")
    item_count = navbar.getElementsByTagName("a").length
    desired_height = 4 + 2 * item_count
    document.getElementById("mySidebar").style.height = desired_height + "rem"

    if (document.getElementById("mySidebar").style.maxHeight != "100%") {
        document.getElementById("mySidebar").style.maxHeight = "100%";
        document.getElementsByClassName("content")[0].style.paddingLeft = desired_height + "em"
    } else {
        document.getElementById("mySidebar").style.maxHeight = "0";
        document.getElementsByClassName("content")[0].style.paddingLeft = "0"
    }
}