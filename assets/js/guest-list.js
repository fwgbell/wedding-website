// Guest list configuration
// Edit this file to add your guests and set passwords/access levels

const guestList = [
  // Format: an array of groups, where each group is an array of guests.
  // Guest format: { name: "Full Name", access: "both" | "day1" | "day2", password: "optional-password" }
  // If password is empty, they use the default site password
  
  // Example groups - REPLACE WITH YOUR ACTUAL GUEST LIST:
  [
    { name: "John Smith", access: "both", password: "" },
    { name: "Jane Smith", access: "both", password: "" },
  ],
  [
    { name: "Alice Johnson", access: "day1", password: "" },
  ],
  [
    { name: "Bob Williams", access: "day2", password: "" },
  ],
  [
    { name: "Charlie Brown", access: "both", password: "" },
  ],
  
  // Add more groups here...
];

// Site passwords - guests need one of these to access the site
// Leave both empty to disable password protection
const fullAccessPassword = "Grange";
const day2AccessPassword = "Denbigh";

// Default access level if no password is set
// Options: "both", "day1", "day2"
const defaultAccess = "both";
