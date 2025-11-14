import React, { useState, useMemo } from 'react';
import { glossary } from '../../data/schemas/glossary';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, BookOpen, Tag } from 'lucide-react';

export const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(glossary.map((term) => term.category)))];

  const filteredTerms = useMemo(() => {
    return glossary.filter((term) => {
      const matchesSearch =
        searchTerm === '' ||
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <BookOpen className="h-8 w-8 mr-3 text-primary" />
          Statistical Glossary
        </h1>
        <p className="text-muted-foreground">
          Comprehensive reference for statistical terms and concepts
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search terms or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredTerms.length} of {glossary.length} terms
      </div>

      {/* Glossary Terms */}
      <div className="space-y-4">
        {filteredTerms.map((term) => (
          <Card key={term.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{term.term}</CardTitle>
                  <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded capitalize">
                    {term.category}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground">{term.definition}</p>

              {term.examples && term.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Examples:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {term.examples.map((example, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {term.relatedTerms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Related Terms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {term.relatedTerms.map((relatedId) => {
                      const relatedTerm = glossary.find((t) => t.id === relatedId);
                      return relatedTerm ? (
                        <span
                          key={relatedId}
                          className="px-2 py-1 bg-muted text-xs rounded cursor-pointer hover:bg-muted/80"
                          onClick={() => {
                            setSearchTerm(relatedTerm.term);
                            setSelectedCategory('all');
                          }}
                        >
                          {relatedTerm.term}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-muted-foreground">No terms found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
