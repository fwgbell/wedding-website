// Guest list configuration
// Edit this file to add your guests and set passwords/access levels

const guestList = [
  // Format: an array of groups, where each group is an array of guests.
  // Guest format: { name: "Full Name", access: "both" | "day1" | "day2", password: "optional-password" }
  // If password is empty, they use the default site password
  [
    { name: "Frederick Bell", access: "both", password: "" },
    { name: "Flora Thomas", access: "both", password: "" },
  ],
  [
    { name: "Susie Millward", access: "both", password: "" },
    { name: "Jem Millward", access: "both", password: "" },
  ],
  [
    { name: "Hector Bell", access: "both", password: "" },
    { name: "Neve Bell", access: "both", password: "" },
  ],
  [
    { name: "Lucy Carroll", access: "both", password: "" },
    { name: "Jatin Singh Dhillon", access: "both", password: "" },
  ],
  [
    { name: "Jimmy Carroll", access: "both", password: "" },
    { name: "Steffi Carroll", access: "both", password: "" },
  ],
  [
    { name: "Jeremy Ryall", access: "both", password: "" },
    { name: "Teresa Ryall", access: "both", password: "" },
  ],
  [
    { name: "Poppy Curran-Whitburn", access: "both", password: "" },
    { name: "Matt Curran-Whitburn", access: "both", password: "" },
  ],
  [
    { name: "Ben Ryall", access: "day2", password: "" },
    { name: "Phoebe Rodgers", access: "day2", password: "" },
  ],
  [
    { name: "Max Ryall", access: "both", password: "" },
    { name: "Evie Ryall", access: "both", password: "" },
  ],
  [
    { name: "Uncle Ian", access: "both", password: "" },
    { name: "Auntie Dympna", access: "both", password: "" },
  ],
  [
    { name: "Sinead Clegg", access: "both", password: "" },
    { name: "Martin Clegg", access: "both", password: "" },
  ],
  [
    { name: "Serena Keough", access: "both", password: "" },
    { name: "Danny Keough", access: "both", password: "" },
  ],
  [
    { name: "Auntie Pam", access: "both", password: "" },
  ],
  [
    { name: "Uncle Russel", access: "both", password: "" },
  ],
  [
    { name: "Auntie Jane", access: "day2", password: "" },
  ],
  [
    { name: "Jane Butcher", access: "both", password: "" },
  ],
  [
    { name: "John Butcher", access: "both", password: "" },
  ],
  [
    { name: "Maria Chambers", access: "both", password: "" },
    { name: "Alistair Muir", access: "both", password: "" },
  ],
  [
    { name: "Mungo Chambers", access: "both", password: "" },
  ],
  [
    { name: "Cal Richards", access: "day2", password: "" },
  ],
  [
    { name: "Julia Mitchell", access: "both", password: "" },
  ],
  [
    { name: "George Rawlins", access: "both", password: "" },
    { name: "Margaret Rawlins", access: "both", password: "" },
  ],
  [
    { name: "Keelan McNulty", access: "both", password: "" },
    { name: "Siobahn Meaney", access: "both", password: "" },
  ],
  [
    { name: "Tim Drummond Smith", access: "both", password: "" },
  ],
  [
    { name: "Jack Daniel", access: "both", password: "" },
  ],
  [
    { name: "Chloë Cochran", access: "both", password: "" },
    { name: "Daniel Carey", access: "both", password: "" },
  ],
  [
    { name: "Derrick Hillman", access: "both", password: "" },
  ],
  [
    { name: "Eric Hillman", access: "both", password: "" },
  ],
  [
    { name: "Ruairi Hafferty Hay", access: "both", password: "" },
    { name: "Xanthe Wignall", access: "both", password: "" },
  ],
  [
    { name: "Peter Braidley", access: "day2", password: "" },
  ],
  [
    { name: "Jon Hardman", access: "both", password: "" },
    { name: "Tash Harley", access: "both", password: "" },
  ],
  [
    { name: "Sarah-Jayne Sealy", access: "both", password: "" },
  ],
  [
    { name: "Matt Lawrence", access: "both", password: "" },
  ],
  [
    { name: "Callum Jepps", access: "both", password: "" },
    { name: "Marianne Neri", access: "both", password: "" },
  ],
  [
    { name: "Ben Crowe", access: "both", password: "" },
    { name: "Michelle Crowe", access: "both", password: "" },
  ],
  [
    { name: "Harry Johnston", access: "both", password: "" },
    { name: "Molly McLeod", access: "both", password: "" },
  ],
  [
    { name: "Sam Talbot", access: "both", password: "" },
    { name: "Zoe Clegg", access: "both", password: "" },
  ],
  [
    { name: "Toby Hanscomb", access: "both", password: "" },
    { name: "Tash Ross", access: "both", password: "" },
  ],
  [
    { name: "Joe Aylward", access: "both", password: "" },
    { name: "Inês Rodrigues dos Santos", access: "both", password: "" },
  ],
  [
    { name: "Hugo Spink", access: "both", password: "" },
    { name: "Nicole Spink", access: "both", password: "" },
  ],
  [
    { name: "Mark Coram James", access: "both", password: "" },
    { name: "Susie Hunt", access: "both", password: "" },
  ],
  [
    { name: "Tom Pugh", access: "both", password: "" },
    { name: "Vic Pugh", access: "both", password: "" },
  ],
  [
    { name: "Oscar von Claer", access: "both", password: "" },
  ],
  [
    { name: "Lucas Fabbri", access: "both", password: "" },
    { name: "Lizzy Hammerton", access: "both", password: "" },
  ],
  [
    { name: "Harry Stow", access: "both", password: "" },
  ],
  [
    { name: "Ben Femiola", access: "both", password: "" },
  ],
  [
    { name: "Haydn Read", access: "both", password: "" },
  ],
  [
    { name: "Gin Laboviciute", access: "both", password: "" },
    { name: "Liam White", access: "both", password: "" },
  ],
  [
    { name: "Maggie Shreeve", access: "day2", password: "" },
    { name: "Rob Shreeve", access: "day2", password: "" },
  ],
  [
    { name: "Miriam Cheal", access: "day2", password: "" },
    { name: "Jonathan Cheal", access: "day2", password: "" },
  ],
  [
    { name: "Sally Browne", access: "day2", password: "" },
    { name: "Peter Browne", access: "day2", password: "" },
  ],
  [
    { name: "Caroline Nolder", access: "both", password: "" },
    { name: "David Nolder", access: "both", password: "" },
  ],
  [
    { name: "Maureen McNulty", access: "day2", password: "" },
    { name: "John McNulty", access: "day2", password: "" },
  ],
  [
    { name: "Philly Middleton", access: "both", password: "" },
    { name: "Andrew Middleton", access: "both", password: "" },
  ],
  [
    { name: "Holly Millward", access: "both", password: "" },
  ],
  [
    { name: "Julia Thomas", access: "both", password: "" },
    { name: "Neil Thomas", access: "both", password: "" },
  ],
  [
    { name: "Milly Bridgeman", access: "both", password: "" },
    { name: "Luke Bridgeman", access: "both", password: "" },
  ],
  [
    { name: "Lucy Thomas", access: "both", password: "" },
    { name: "James Montero-MacColl", access: "both", password: "" },
  ],
  [
    { name: "Ella Thomas", access: "both", password: "" },
  ],
  [
    { name: "Joy Cole", access: "both", password: "" },
  ],
  [
    { name: "Betty Thomas", access: "both", password: "" },
  ],
  [
    { name: "Peter Thomas", access: "both", password: "" },
    { name: "Rachel Thomas", access: "both", password: "" },
  ],
  [
    { name: "Emily Wellington", access: "both", password: "" },
    { name: "Ben Wellington", access: "both", password: "" },
  ],
  [
    { name: "Susan Thomas", access: "both", password: "" },
    { name: "Susan +1 (Peter)", access: "both", password: "" },
  ],
  [
    { name: "Paul Onslow-Cole", access: "both", password: "" },
    { name: "Julia Onslow-Cole", access: "both", password: "" },
  ],
  [
    { name: "Tom Onslow-Cole", access: "both", password: "" },
    { name: "Rebecca Onslow-Cole", access: "both", password: "" },
  ],
  [
    { name: "Gemma Johnson", access: "both", password: "" },
    { name: "Wanda", access: "both", password: "" },
  ],
  [
    { name: "Serena Pugh", access: "both", password: "" },
  ],
  [
    { name: "Sienna Smallman", access: "both", password: "" },
    { name: "Rory McDonald", access: "both", password: "" },
  ],
  [
    { name: "Megan O'Shea", access: "both", password: "" },
    { name: "Rishi Bhabutta", access: "both", password: "" },
  ],
  [
    { name: "Louise Bernander", access: "both", password: "" },
    { name: "Stefan Jovicic", access: "both", password: "" },
  ],
  [
    { name: "Jack Smith-Tilley", access: "both", password: "" },
    { name: "Jan Mackie", access: "both", password: "" },
  ],
  [
    { name: "Henry Berridge-Dunn", access: "both", password: "" },
    { name: "Caitlin Berridge-Dunn", access: "both", password: "" },
  ],
  [
    { name: "Aysel Akhundova", access: "both", password: "" },
    { name: "James Chisholm", access: "both", password: "" },
  ],
  [
    { name: "Connie Freer-Smith", access: "both", password: "" },
    { name: "Robin Mackworth-Young", access: "both", password: "" },
  ],
  [
    { name: "Yasmin Siabi", access: "both", password: "" },
    { name: "Tristan", access: "both", password: "" },
  ],
  [
    { name: "Immy Allner", access: "both", password: "" },
    { name: "Jamie Allner", access: "both", password: "" },
  ],
  [
    { name: "Alice Goodinge", access: "both", password: "" },
  ],
  [
    { name: "Clara Austera", access: "both", password: "" },
    { name: "Ollie Skan", access: "both", password: "" },
  ],
  [
    { name: "Clem Barrett", access: "both", password: "" },
    { name: "Harrison Fookes", access: "both", password: "" },
  ],
  [
    { name: "Alex Miller", access: "both", password: "" },
  ],
  [
    { name: "Joe Ryan", access: "both", password: "" },
  ],
  [
    { name: "Katie Beeton", access: "both", password: "" },
    { name: "Fernando", access: "both", password: "" },
  ],
  [
    { name: "George Isbister", access: "both", password: "" },
    { name: "Freya", access: "both", password: "" },
  ],
  [
    { name: "Wilf van Geest", access: "both", password: "" },
    { name: "Alex (VG)", access: "both", password: "" },
  ],
  [
    { name: "Christine Connelly", access: "both", password: "" },
  ],
  [
    { name: "Lisa Case", access: "day2", password: "" },
    { name: "Jeremy", access: "day2", password: "" },
  ],
  [
    { name: "Amanda Isbister", access: "both", password: "" },
    { name: "Andrew Isbister", access: "both", password: "" },
  ],
  [
    { name: "Su Beeton", access: "both", password: "" },
    { name: "Danny Beeton", access: "both", password: "" },
  ],
  [
    { name: "Elizabeth van Geest", access: "both", password: "" },
    { name: "Leonard van Geest", access: "both", password: "" },
  ],
  [
    { name: "Jill Robertson", access: "both", password: "" },
    { name: "Brian Robertson", access: "both", password: "" },
  ],
  [
    { name: "Deborah Walker", access: "both", password: "" },
  ],
  [
    { name: "Carol Stubbings", access: "both", password: "" },
    { name: "Phil Stubbings", access: "both", password: "" },
  ],
  [
    { name: "Rob Kickham", access: "both", password: "" },
    { name: "Viv Kickham", access: "both", password: "" },
  ],
  [
    { name: "Su Annesley", access: "day2", password: "" },
    { name: "Howard Annesley", access: "day2", password: "" },
  ],
  [
    { name: "Peter Clarke", access: "both", password: "" },
    { name: "Karen Clarke", access: "both", password: "" },
  ],
  [
    { name: "Sahia", access: "both", password: "" },
    { name: "Hamed", access: "both", password: "" },
  ],
  [
    { name: "Ebs Smallman", access: "both", password: "" },
    { name: "Robbie Mavor", access: "both", password: "" },
  ],
  [
    { name: "Richard", access: "day2", password: "" },
    { name: "Wayne", access: "day2", password: "" },
  ],
  [
    { name: "Jacqui Bounsall-Hughes", access: "day2", password: "" },
    { name: "Vinnie Bounsall-Hughes", access: "day2", password: "" },
  ],
  [
    { name: "Matilda", access: "day2", password: "" },
  ],
  [
    { name: "Alice", access: "day2", password: "" },
  ],
  [
    { name: "Dotty", access: "day2", password: "" },
  ],
  [
    { name: "Marilyn", access: "day2", password: "" },
    { name: "Alan", access: "day2", password: "" },
  ],
  [
    { name: "Bev Bridgeman", access: "day2", password: "" },
    { name: "Lee Bridgeman", access: "day2", password: "" },
  ],
  [
    { name: "Pat Evans", access: "day2", password: "" },
    { name: "Pat Evans (+1)", access: "day2", password: "" },
  ],
  [
    { name: "Carolyn Chittick", access: "day2", password: "" },
    { name: "Peter Chittick", access: "day2", password: "" },
  ],
  [
    { name: "Diane Lewis", access: "day2", password: "" },
  ],
  [
    { name: "Hollie Onslow-Cole", access: "day2", password: "" },
    { name: "Jayda Onslow-Cole", access: "day2", password: "" },
  ],
];

// Site passwords - guests need one of these to access the site
// Leave both empty to disable password protection
const fullAccessPassword = "Grange";
const day2AccessPassword = "Denbigh";

// Default access level if no password is set
// Options: "both", "day1", "day2"
const defaultAccess = "both";
