import { useState, useEffect } from 'react'
import axios from 'axios'
import Weather from './components/Weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    if (search) {
      axios
        .get(`https://restcountries.com/v3.1/name/${search}`)
        .then(response => {
          setCountries(response.data)
        })
        .catch(error => {
          setCountries([])
        })
    } else {
      setCountries([])
    }
  }, [search])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowClick = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const renderCountryList = () => {
    if (countriesToShow.length > 10) {
      return <div>Too many matches, specify another filter</div>
    }

    if (countriesToShow.length > 1) {
      return (
        <div>
          {countriesToShow.map(country => (
            <div key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleShowClick(country)}>
                show
              </button>
            </div>
          ))}
        </div>
      )
    }

    if (countriesToShow.length === 1) {
      return renderCountryDetail(countriesToShow[0])
    }

    return null
  }

  const renderCountryDetail = (country) => {
    if (!country) return null

    const languages = Object.values(country.languages || {})
    const flagUrl = country.flags?.png || country.flags?.svg

    return (
      <div>
        <h2>{country.name.common}</h2>
        
        <div>Capital: {country.capital?.[0] || 'N/A'}</div>
        <div>Area: {country.area?.toLocaleString() || 'N/A'}</div>
        
        <h3>Languages:</h3>
        <ul>
          {languages.map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        
        {flagUrl && (
          <img 
            src={flagUrl} 
            alt={`Flag of ${country.name.common}`} 
            style={{ width: '200px', border: '1px solid black' }}
          />
        )}
        
        {country.capital && (
          <Weather capital={country.capital[0]} />
        )}
      </div>
    )
  }

  return (
    <div>
      <div>
        find countries
        <input 
          value={search} 
          onChange={handleSearchChange} 
        />
      </div>
      
      {selectedCountry ? (
        renderCountryDetail(selectedCountry)
      ) : (
        renderCountryList()
      )}
    </div>
  )
}

export default App