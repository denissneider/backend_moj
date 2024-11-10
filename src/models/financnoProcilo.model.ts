const financnoPorociloSchema = new mongoose.Schema({
    naslov: { type: String, required: true },
    datum: { type: Date, default: Date.now },
    vsebina: { type: String, required: true },
    avtor: { type: mongoose.Schema.Types.ObjectId, ref: 'Zaposleni' }
  });
  
  const FinancnoPorocilo = mongoose.model('FinancnoPorocilo', financnoPorociloSchema);
  