import natural from "natural";
import Vector from 'vector-object'
const TfIdf = natural.TfIdf;

export const formatData = (jobData) => {
    let formatted = [];

    for(let job of jobData) {
        let content = '';
        content += ` ${job.title.toLowerCase()}`;
        content += ` ${job.jobLevel.toLowerCase()}`
        content += ` ${job.jobType.toLowerCase()}`
        if(job.fullTime) {
            content += ' fulltime'
        } else {
            content += ' parttime'
        }
        job.requiredSkill.map(i => {
            content += ` ${i.skillName}`.toLowerCase();
        })
        content += ` ${job.companyId.name}`

        formatted.push({ id: job._id, content })
    }

    return formatted;
};

export const createVectorsFromDocs = (processedDocs) => {
    const tfidf = new TfIdf();

    processedDocs.forEach((processedDocument) => {
        tfidf.addDocument(processedDocument.content);
    });

    const documentVectors = [];

    for (let i = 0; i < processedDocs.length; i++) {
        const processedDocument = processedDocs[i];
        const obj = {};
        const items = tfidf.listTerms(i);

        for (let j = 0; j < items.length; j++) {
            const item = items[j];
            obj[item.term] = item.tfidf;
        }

        const documentVector = {
            id: processedDocument.id,
            vector: new Vector(obj),
        };

        documentVectors.push(documentVector);
    }

    return documentVectors;
};

export const calcSimilarities = (docVectors) => {
    const MAX_SIMILAR = 15;
    const MIN_SCORE = 0.4;
    const data = {};

    for (let i = 0; i < docVectors.length; i++) {
        const { id } = docVectors[i];
        data[id] = [];
    }

    for (let i = 0; i < docVectors.length; i++) {
        for (let j = 0; j < i; j++) {
            const idi = docVectors[i].id;
            const vi = docVectors[i].vector;
            const idj = docVectors[j].id;
            const vj = docVectors[j].vector;
            const similarity = vi.getCosineSimilarity(vj);

            if (similarity > MIN_SCORE) {
                data[idi].push({ id: idj, score: similarity });
                data[idj].push({ id: idi, score: similarity });
            }
        }
    }

    Object.keys(data).forEach((id) => {
        data[id].sort((a, b) => b.score - a.score);

        if (data[id].length > MAX_SIMILAR) {
            data[id] = data[id].slice(0, MAX_SIMILAR);
        }
    });

    return data;
};
