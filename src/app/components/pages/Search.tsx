import { useState } from "react";
import { Search as SearchIcon, MapPin, Phone, Mail, CheckCircle, XCircle } from "lucide-react";

interface School {
  id: number;
  name: string;
  location: string;
  phone: string;
  email: string;
  uniformsAvailable: boolean;
  uniformTypes: string[];
}

const mockSchools: School[] = [
  {
    id: 1,
    name: "St. Mary's High School",
    location: "Downtown, City Center",
    phone: "+1 234 567 8901",
    email: "admin@stmarys.edu",
    uniformsAvailable: true,
    uniformTypes: ["Boys Shirt", "Girls Shirt", "Trousers", "Skirt", "Tie", "Sports Wear"],
  },
  {
    id: 2,
    name: "Greenwood Academy",
    location: "North District",
    phone: "+1 234 567 8902",
    email: "info@greenwood.edu",
    uniformsAvailable: true,
    uniformTypes: ["Boys Shirt", "Girls Shirt", "Trousers", "Skirt", "Blazer"],
  },
  {
    id: 3,
    name: "Riverside Public School",
    location: "East Riverside",
    phone: "+1 234 567 8903",
    email: "contact@riverside.edu",
    uniformsAvailable: true,
    uniformTypes: ["Boys Shirt", "Girls Shirt", "Trousers", "Skirt", "Sports Wear"],
  },
  {
    id: 4,
    name: "Oakwood International",
    location: "West End",
    phone: "+1 234 567 8904",
    email: "admissions@oakwood.edu",
    uniformsAvailable: false,
    uniformTypes: [],
  },
  {
    id: 5,
    name: "Sunrise Elementary",
    location: "South Quarter",
    phone: "+1 234 567 8905",
    email: "hello@sunrise.edu",
    uniformsAvailable: true,
    uniformTypes: ["Boys Shirt", "Girls Shirt", "Shorts", "Skirt", "Tie"],
  },
  {
    id: 6,
    name: "Royal Grammar School",
    location: "Central Business District",
    phone: "+1 234 567 8906",
    email: "info@royal.edu",
    uniformsAvailable: true,
    uniformTypes: ["Boys Shirt", "Girls Shirt", "Trousers", "Skirt", "Blazer", "Tie", "Sports Wear"],
  },
];

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState<"all" | "available" | "unavailable">("all");

  const filteredSchools = mockSchools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAvailability =
      selectedAvailability === "all" ||
      (selectedAvailability === "available" && school.uniformsAvailable) ||
      (selectedAvailability === "unavailable" && !school.uniformsAvailable);

    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Search Schools & Uniforms</h1>
          <p className="text-gray-600 text-lg">
            Find schools and check uniform availability instantly
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={24}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by school name or location..."
              className="w-full border-2 border-black pl-14 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAvailability("all")}
              className={`px-6 py-2 border-2 transition-all ${
                selectedAvailability === "all"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-gray-100"
              }`}
            >
              All Schools
            </button>
            <button
              onClick={() => setSelectedAvailability("available")}
              className={`px-6 py-2 border-2 transition-all ${
                selectedAvailability === "available"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-gray-100"
              }`}
            >
              Uniforms Available
            </button>
            <button
              onClick={() => setSelectedAvailability("unavailable")}
              className={`px-6 py-2 border-2 transition-all ${
                selectedAvailability === "unavailable"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-gray-100"
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="text-black">{filteredSchools.length}</span> school(s)
          </p>
        </div>

        {/* Schools List */}
        <div className="space-y-6">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="border-2 border-black p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* School Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <h2 className="text-2xl">{school.name}</h2>
                    {school.uniformsAvailable ? (
                      <span className="bg-black text-white px-3 py-1 text-sm whitespace-nowrap">
                        ✓ Available
                      </span>
                    ) : (
                      <span className="border border-black px-3 py-1 text-sm whitespace-nowrap">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} />
                      <span>{school.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={18} />
                      <span>{school.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={18} />
                      <span>{school.email}</span>
                    </div>
                  </div>

                  {/* Available Uniforms */}
                  {school.uniformsAvailable && school.uniformTypes.length > 0 && (
                    <div>
                      <h3 className="mb-2">Available Uniform Types:</h3>
                      <div className="flex flex-wrap gap-2">
                        {school.uniformTypes.map((type, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 border border-gray-300 px-3 py-1 text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:min-w-[200px]">
                  {school.uniformsAvailable ? (
                    <>
                      <button className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors">
                        View Uniforms
                      </button>
                      <button className="border-2 border-black px-6 py-3 hover:bg-gray-100 transition-colors">
                        Contact School
                      </button>
                    </>
                  ) : (
                    <button className="border-2 border-gray-300 text-gray-400 px-6 py-3 cursor-not-allowed">
                      Not Available Yet
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSchools.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-300">
            <SearchIcon className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-2xl text-gray-400 mb-2">No schools found</p>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-black text-white p-8">
          <h3 className="text-2xl mb-4">Can't find your school?</h3>
          <p className="mb-4">
            We're constantly adding new schools to our database. If you don't see your school listed,
            please contact us and we'll work on adding it.
          </p>
          <button className="bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors">
            Request School Addition
          </button>
        </div>
      </div>
    </div>
  );
}
