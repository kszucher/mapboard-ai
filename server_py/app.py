from docling.document_converter import DocumentConverter

source = "krisztian_szucher_cv_em.pdf"  # document per local path or URL
converter = DocumentConverter()
result = converter.convert(source)
print(result.document.export_to_dict())  # output: "## Docling Technical Report[...]"

# ingestion: file link --> JSON { docling }
# vectorDatabase: JSON [], text [], question --> válasz amit a vector db ad
# extraction: question, vectorDb válasz --> szöveg

# text input
# text output --> prompt
