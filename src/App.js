import React from 'react'
import Modell from './model/Shopping'
import GruppenTag from './components/GruppenTag'
import GruppenDialog from './components/GruppenDialog'
import SortierDialog from "./components/SortierDialog";


class App extends React.Component {
  constructor(props) {
    super(props)
    this.initialisieren()
    this.state = {
      aktiveGruppe: null,
      showGruppenDialog: false,
      showSortierDialog: false,
      einkaufenAufgeklappt: true,
      erledigtAufgeklappt: false
    }
  }

  initialisieren() {
    let asien = Modell.gruppeHinzufuegen("Asien")
    let ziel1 = asien.artikelHinzufuegen("Palästina - Jerusalem")
    asien.artikelHinzufuegen("Oman - Maskat")
    asien.artikelHinzufuegen("Singapur")
    asien.artikelHinzufuegen("Malediven - Malé")
    asien.artikelHinzufuegen("Türkei - Gazi-Antep")
    asien.artikelHinzufuegen("Indien - New-Delhi")
    asien.artikelHinzufuegen("Türkei - Istanbul")

    let nordamerika = Modell.gruppeHinzufuegen("Nord Amerika")
    let ziel2 = nordamerika.artikelHinzufuegen("New York - New York")
    nordamerika.artikelHinzufuegen("Florida - Miami")
    nordamerika.artikelHinzufuegen("Illinois - Chicago")
    nordamerika.artikelHinzufuegen("Louisiana - New Orleans")
    nordamerika.artikelHinzufuegen("Kalifornien - San Francico")

    let suedamerika = Modell.gruppeHinzufuegen("Süd Amerika")
    let ziel3 =suedamerika.artikelHinzufuegen("Bolivien - Salar de Uyuni")
    suedamerika.artikelHinzufuegen("Brasilien - Rio de Janero")
    suedamerika.artikelHinzufuegen("Kolumbien - Tayrona Nationalpark")
    suedamerika.artikelHinzufuegen("Peru - Machu Picchu")
    suedamerika.artikelHinzufuegen("Venezuela - Salto Ángel")

    let afrika = Modell.gruppeHinzufuegen("Afrika")
    let ziel4 = afrika.artikelHinzufuegen("Ägypten - Rotes Meer")
    afrika.artikelHinzufuegen("Tansania - Sansibar")
    afrika.artikelHinzufuegen("Marokko - Chefchaouen")
    afrika.artikelHinzufuegen("Namibia - Namib Wüste")
    afrika.artikelHinzufuegen("Ghana - Accra")
    afrika.artikelHinzufuegen("Nigeria - Abuja")

    let europa = Modell.gruppeHinzufuegen("Europa")
    let ziel5 = europa.artikelHinzufuegen("Mazedonien - Ohrid")
    europa.artikelHinzufuegen("Schweden - Stockholm")
    europa.artikelHinzufuegen("Kosovo - Prizren")
    europa.artikelHinzufuegen("England - London")
    europa.artikelHinzufuegen("Bosnien - Sarajevo")
    europa.artikelHinzufuegen("Portugal - Lissabon")
    europa.artikelHinzufuegen("Bosnien - Tara")
    europa.artikelHinzufuegen("Spanien - Barcelona")
    europa.artikelHinzufuegen("Albanien - Saranda")
  }
//
  einkaufenAufZuKlappen() {
    let neuerZustand = !this.state.einkaufenAufgeklappt
    this.setState({einkaufenAufgeklappt: neuerZustand})
  }

  erledigtAufZuKlappen() {
    this.setState({erledigtAufgeklappt: !this.state.erledigtAufgeklappt})
  }

  /**
   *
   * @param artikel
   */
  artikelChecken = (artikel) => {
    artikel.gekauft = !artikel.gekauft
    const aktion = (artikel.gekauft) ? "erledigt" : "reaktiviert"
    Modell.informieren("[App] Artikel \"" + artikel.name + "\" wurde " + aktion)
    this.setState(this.state)
  }

  /**
   * Fügt den Artikel zur aktiven Gruppe hinzu.
   */
  artikelHinzufuegen() {
    const eingabe = document.getElementById("artikelEingabe")
    const artikelName = eingabe.value.trim()
    if (artikelName.length > 0) {
      Modell.aktiveGruppe.artikelHinzufuegen(artikelName)
      this.setState(this.state)
    }
    eingabe.value = ""
    eingabe.focus()
  }

  /**
   * Zeigt die aktive Gruppe an.
   * @param gruppe
   */
  setAktiveGruppe(gruppe) {
    Modell.aktiveGruppe = gruppe
    Modell.informieren("[App] Gruppe \"" + gruppe.name + "\" ist nun aktiv")
    this.setState({aktiveGruppe: Modell.aktiveGruppe})
  }

  /**
   * Sortiert die Reihenfolge innerhalb der Gruppe.
   * @param reihenfolge
   * @param sortieren
   */
  closeSortierDialog = (reihenfolge, sortieren) => {
    if (sortieren) {
      Modell.sortieren(reihenfolge)
    }
    this.setState({showSortierDialog: false})
  }

  render() {
    let reiseZiele = []
    if (this.state.einkaufenAufgeklappt == true) {
      for (const gruppe of Modell.gruppenListe) {
        reiseZiele.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={false}
          aktiv={gruppe == this.state.aktiveGruppe}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }

    let schonBereist = []
    if (this.state.erledigtAufgeklappt) {
      for (const gruppe of Modell.gruppenListe) {
        schonBereist.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={true}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }

    let gruppenDialog = ""
    if (this.state.showGruppenDialog) {
      gruppenDialog = <GruppenDialog
        gruppenListe={Modell.gruppenListe}
        onDialogClose={() => this.setState({showGruppenDialog: false})}/>
    }

    let sortierDialog = ""
    if (this.state.showSortierDialog) {
      sortierDialog = <SortierDialog onDialogClose={this.closeSortierDialog}/>
    }

    return (
      <div id="container">
        <header>
          <h1>Travellist</h1>
          <label
            className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
            <span className="mdc-text-field__ripple"></span>
            <input className="mdc-text-field__input" type="search"
                   id="artikelEingabe" placeholder="Ziele hinzufügen"
                   onKeyPress={e => (e.key == 'Enter') ? this.artikelHinzufuegen() : ''}/>
            <span className="mdc-line-ripple"></span>
            <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
               tabIndex="0" role="button"
               onClick={() => this.artikelHinzufuegen()}>add_circle</i>
          </label>

        </header>
        <hr/>

        <main>
          <section>
            <h2>Reise Ziele
              <i onClick={() => this.einkaufenAufZuKlappen()} className="material-icons">
                {this.state.einkaufenAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {reiseZiele}
            </dl>
          </section>
          <hr/>
          <section>
            <h2>Schon bereist
              <i onClick={() => this.erledigtAufZuKlappen()} className="material-icons">
                {this.state.erledigtAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {schonBereist}
            </dl>
          </section>
        </main>
        <hr/>

        <footer>
          <button className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showGruppenDialog: true})}>
            <span className="material-icons">bookmark_add</span>
            <span className="mdc-button__ripple"></span> Gruppen
          </button>
          <button className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showSortierDialog: true})}>
            <span className="material-icons">sort</span>
            <span className="mdc-button__ripple"></span> Sort
          </button>
          <button className="mdc-button mdc-button--raised">
            <span className="material-icons">settings</span>
            <span className="mdc-button__ripple"></span> Setup
          </button>
        </footer>

        {gruppenDialog}
        {sortierDialog}
      </div>
    )
  }
}

export default App
