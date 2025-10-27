import React, { useMemo, useState } from 'react'
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'

const PRESET_AREAS = ['All', 'Dublin 1', 'Dublin 2', 'Dublin 3', 'Dublin 4', 'Dublin 6', 'Dublin 7', 'Dublin 8', 'South County Dublin', 'North County Dublin']
const PRESET_FAITHS = ['All', 'Christian (Catholic)', 'Christian (Protestant)', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'Other']
const PRESET_SERVICES = ['All', 'Sunday Service', 'Friday Prayers', 'Sabbath Service', 'Daily Mass', 'Meditation / Study Group']

const FALLBACK_LISTINGS = [
  { id: 'st-pats', name: "St. Patrick's Cathedral", faith: 'Christian (Protestant)', area: 'Dublin 8', address: "St Patrick's Close, Dublin 8", lat: 53.3390, lng: -6.2711, serviceType: 'Sunday Service' },
  { id: 'dublin-mosque', name: 'Dublin Mosque & Islamic Centre', faith: 'Muslim', area: 'Dublin 1', address: 'Abbey Street, Dublin 1', lat: 53.3498, lng: -6.2680, serviceType: 'Friday Prayers' },
  { id: 'hindu-centre', name: 'Hindu Cultural Centre', faith: 'Hindu', area: 'Dublin 2', address: 'Drury Street, Dublin 2', lat: 53.3445, lng: -6.2592, serviceType: 'Meditation / Study Group' },
  { id: 'christchurch', name: 'Christ Church Cathedral', faith: 'Christian (Anglican)', area: 'Dublin 8', address: 'Christchurch Place, Dublin 8', lat: 53.3438, lng: -6.2715, serviceType: 'Sunday Service' },
]

function Button({children, className, ...props}){ return <button className={"btn " + (className||"")} {...props}>{children}</button> }

export default function Home(){
  const [listings] = useState(FALLBACK_LISTINGS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFaith, setSelectedFaith] = useState('All')
  const [selectedArea, setSelectedArea] = useState('All')
  const [selectedService, setSelectedService] = useState('All')

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''
  const { isLoaded } = useLoadScript({ googleMapsApiKey: mapsKey })

  const filteredListings = useMemo(()=>{
    const q = (searchTerm||'').trim().toLowerCase()
    return listings.filter(l => {
      if (selectedFaith !== 'All' && (l.faith||'').toLowerCase() !== selectedFaith.toLowerCase()) return false
      if (selectedArea !== 'All' && (l.area||'').toLowerCase() !== selectedArea.toLowerCase()) return false
      if (selectedService !== 'All' && (l.serviceType||'').toLowerCase() !== selectedService.toLowerCase()) return false
      if (!q) return true
      const hay = `${l.name} ${l.faith} ${l.area} ${l.address}`.toLowerCase()
      return hay.includes(q)
    })
  },[listings, searchTerm, selectedFaith, selectedArea, selectedService])

  function clearAll(){ setSearchTerm(''); setSelectedFaith('All'); setSelectedArea('All'); setSelectedService('All') }

  return (
    <div>
      <header className="header">
        <div className="logo">
          <div className="mark">LW</div>
          <div>
            <div style={{fontWeight:700}}>LocalWorship.ie</div>
            <div style={{fontSize:12,color:'#6b7280'}}>Places of worship • Dublin</div>
          </div>
        </div>
        <nav style={{display:'flex',gap:12}}>
          <a href="#">Explore</a><a href="#events">Events</a><a href="#about">About</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-left">
            <h1 className="title">Find a place of peace and prayer near you</h1>
            <p className="lead">Discover churches, mosques, temples, synagogues, and more across Dublin.</p>

            <div className="controls">
              <input className="input" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search by name, faith, or location..." />
              <select className="select" value={selectedFaith} onChange={e=>setSelectedFaith(e.target.value)}>
                {PRESET_FAITHS.map(f=> <option key={f} value={f}>{f}</option>)}
              </select>
              <select className="select" value={selectedArea} onChange={e=>setSelectedArea(e.target.value)}>
                {PRESET_AREAS.map(a=> <option key={a} value={a}>{a}</option>)}
              </select>
              <select className="select" value={selectedService} onChange={e=>setSelectedService(e.target.value)}>
                {PRESET_SERVICES.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
              <Button onClick={clearAll}>Clear All</Button>
            </div>

            <div style={{marginTop:18}} className="filters-bar">
              <div style={{color:'#6b7280'}}>{(selectedFaith!=='All'||selectedArea!=='All'||selectedService!=='All') ? 'Filtering by: '+[selectedFaith,selectedArea,selectedService].filter(x=>x!=='All').join(', ') : 'Showing all listings'}</div>
              <div style={{fontSize:12,color:'#9ca3af'}}>{filteredListings.length} result{filteredListings.length!==1?'s':''}</div>
            </div>

            <div style={{marginTop:12}}>
              {filteredListings.map(p=> (
                <div key={p.id} className="listing" style={{marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:600}}>{p.name}</div>
                    <div style={{color:'#6b7280',fontSize:13}}>{p.area} • {p.faith}</div>
                    <div style={{marginTop:6,fontSize:13}}>{p.address}</div>
                  </div>
                  <div style={{color:'#6b7280',fontSize:13}}>{p.serviceType}</div>
                </div>
              ))}
              {filteredListings.length===0 && <p style={{color:'#6b7280'}}>No results match your search.</p>}
            </div>
          </div>

          <aside style={{width:420}}>
            <div className="mapBox">
              {isLoaded && mapsKey ? (
                <GoogleMap mapContainerStyle={{width:'100%',height:'100%'}} zoom={12} center={{lat:53.3498,lng:-6.2603}}>
                  {filteredListings.map(place => place.lat && place.lng ? <Marker key={place.id} position={{lat:place.lat,lng:place.lng}} /> : null)}
                </GoogleMap>
              ) : (
                <iframe title="Dublin map" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d23898.9!2d-6.275!3d53.3498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sie!4v1698250000000" style={{width:'100%',height:'100%',border:0}}/>
              )}
            </div>

            <div style={{marginTop:12}}>
              {filteredListings.slice(0,4).map(p=> (
                <div key={p.id} className="smallCard" style={{marginBottom:8}}>
                  <div style={{fontSize:14,fontWeight:600}}>{p.name}</div>
                  <div style={{fontSize:12,color:'#6b7280'}}>{p.area} • {p.faith}</div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} LocalWorship.ie — All faiths, one community.
        </footer>
      </main>
    </div>
  )
}
