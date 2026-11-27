# Sahtekâr

Kelimeyi bilmeyeni bulmaya dayalı parti oyunu. Derleme adımı yok; düz statik dosyalardan oluşur.

| Dosya | İçerik |
|---|---|
| `index.html` | Sayfa iskeleti |
| `style.css` | Tüm görünüm |
| `words.js` | Kategoriler, kelimeler ve ipuçları (düzenlemesi kolay metin biçimi) |
| `app.js` | Tek telefon modu ve ortak arayüz (internetsiz çalışır) |
| `online.js` | Online oda. Yalnızca online moda girilince yüklenir; Supabase kütüphanesini de o an yükler |
| `sw.js`, `manifest.webmanifest`, `icon*` | Ana ekrana eklenebilir uygulama ve çevrimdışı önbellek |

## Kelime eklemek

`words.js` içinde ilgili kategoriye bir satır ekle:

```
Kelime: ipucu, ipucu, ipucu
```

İpuçları aynı kategorideki başka kelimelerde de geçmeli; böylece sahtekâra verilen ipucu kelimeyi ele vermez.
Oyun, bir ipucunun kaç kelimede geçtiğine bakarak zorluk seviyesine göre seçim yapar.

## Yerelde çalıştırmak

```
python3 -m http.server 8000
```

ve tarayıcıda `http://localhost:8000` aç.
